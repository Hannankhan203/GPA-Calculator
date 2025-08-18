import { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { db } from "../../firebase";
import { useAuthStore } from "../../context/store";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

const initialSubject = {
  subjectName: "",
  creditHours: "",
  marks: "",
};

const initialValues = {
  studentName: "",
  semester: "",
  subjects: [initialSubject],
};

const validationSchema = Yup.object({
  studentName: Yup.string().required("Required"),
  semester: Yup.string().required("Required"),
  subjects: Yup.array()
    .of(
      Yup.object().shape({
        subjectName: Yup.string().required("Required"),
        creditHours: Yup.number()
          .required("Required")
          .positive("Must be positive"),
        marks: Yup.number()
          .required("Required")
          .min(0, "Must be between 0-100")
          .max(100, "Must be between 0-100"),
      })
    )
    .min(6, "Minimum 6 subjects required"),
});

const getGradePoint = (marks) => {
  if (marks >= 90) return 4.0;
  if (marks >= 85) return 3.7;
  if (marks >= 80) return 3.3;
  if (marks >= 75) return 3.0;
  if (marks >= 70) return 2.7;
  if (marks >= 65) return 2.3;
  if (marks >= 60) return 2.0;
  if (marks >= 55) return 1.7;
  if (marks >= 50) return 1.3;
  return 1.0;
};

const SGPAForm = () => {
  const { user } = useAuthStore();
  const [sgpa, setSgpa] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null);

  const calculateSGPA = (subjects) => {
    let totalCreditHours = 0;
    let totalGradePoints = 0;

    subjects.forEach((subject) => {
      const gradePoint = getGradePoint(parseFloat(subject.marks));
      totalCreditHours += parseFloat(subject.creditHours);
      totalGradePoints += parseFloat(subject.creditHours) * gradePoint;
    });

    return (totalGradePoints / totalCreditHours).toFixed(2);
  };

  const onSubmit = async (values, { resetForm }) => {
    const calculatedSGPA = calculateSGPA(values.subjects);
    setSgpa(calculatedSGPA);

    const recordData = {
      studentName: values.studentName,
      semester: values.semester,
      subjects: values.subjects,
      sgpa: calculatedSGPA,
      type: "sgpa",
      userId: user.uid,
      createdAt: new Date(),
    };

    try {
      if (editMode && currentRecordId) {
        await setDoc(doc(db, "gpaRecords", currentRecordId), recordData);
      } else {
        await addDoc(collection(db, "gpaRecords"), recordData);
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const handleEditRecord = (record) => {
    setEditMode(true);
    setCurrentRecordId(record.id);
    setSgpa(record.sgpa);
    return {
      studentName: record.studentName,
      semester: record.semester,
      subjects: record.subjects,
    };
  };

  return (
    <div className="sgpa-container">
      <h2 className="form-title">SGPA Calculator</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={editMode}
      >
        {({ values, resetForm }) => (
          <Form className="sgpa-form">
            <div className="form-group">
              <label className="form-label">Student Name</label>
              <Field type="text" name="studentName" className="form-input" />
              <ErrorMessage
                name="studentName"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Semester</label>
              <Field as="select" name="semester" className="form-select">
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </Field>
              <ErrorMessage
                name="semester"
                component="div"
                className="error-message"
              />
            </div>

            <FieldArray name="subjects">
              {({ push, remove }) => (
                <div className="subjects-container">
                  <h3 className="section-title">Subjects</h3>
                  {values.subjects.map((subject, index) => (
                    <div key={index} className="subject-card">
                      <div className="form-group">
                        <label className="form-label">Subject Name</label>
                        <Field
                          type="text"
                          name={`subjects.${index}.subjectName`}
                          className="form-input"
                        />
                        <ErrorMessage
                          name={`subjects.${index}.subjectName`}
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Credit Hours</label>
                        <Field
                          type="number"
                          name={`subjects.${index}.creditHours`}
                          className="form-input"
                        />
                        <ErrorMessage
                          name={`subjects.${index}.creditHours`}
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Marks</label>
                        <Field
                          type="number"
                          name={`subjects.${index}.marks`}
                          className="form-input"
                        />
                        <ErrorMessage
                          name={`subjects.${index}.marks`}
                          component="div"
                          className="error-message"
                        />
                      </div>

                      {values.subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="remove-button"
                        >
                          Remove Subject
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => push(initialSubject)}
                    className="add-button"
                  >
                    + Add Subject
                  </button>

                  <ErrorMessage
                    name="subjects"
                    component="div"
                    className="error-message"
                  />
                </div>
              )}
            </FieldArray>

            <div className="action-buttons">
              <button type="submit" className="submit-button">
                {editMode ? "Update Record" : "Calculate SGPA"}
              </button>
              <button
                type="button"
                onClick={() => resetForm()}
                className="reset-button"
              >
                Reset Form
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {sgpa && (
        <div className="result-container">
          <h3 className="result-title">
            Your SGPA: <span className="result-value">{sgpa}</span>
          </h3>
          {editMode && (
            <button
              onClick={() => {
                setEditMode(false);
                setCurrentRecordId(null);
                setSgpa(null);
              }}
              className="cancel-edit-button"
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SGPAForm;
