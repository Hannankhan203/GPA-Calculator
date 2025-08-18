import { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useAuthStore } from "../../context/store";
import * as Yup from "yup";
import { db, doc, setDoc, collection, addDoc } from "../../firebase";

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
  const [currentRecord, setCurrentRecord] = useState(null);

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
      setEditMode(false);
      setCurrentRecordId(null);
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const handleEditRecord = (record) => {
    setEditMode(true);
    setCurrentRecordId(record.id);
    setCurrentRecord(record);
    setSgpa(record.sgpa);
  };

  return (
    <div>
      <Formik
        initialValues={
          editMode
            ? {
                studentName: currentRecord?.studentName || "",
                semester: currentRecord?.semester || "",
                subjects: currentRecord?.subjects || [initialSubject],
              }
            : initialValues
        }
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ values, isSubmitting, resetForm }) => (
          <Form>
            <div>
              <label>Student Name</label>
              <Field type="text" name="studentName" />
              <ErrorMessage name="studentName" component="div" />
            </div>
            <div>
              <label>Semester</label>
              <Field as="select" name="semester">
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
              <ErrorMessage name="semester" component="div" />
            </div>
            <FieldArray name="subjects">
              {({ push, remove }) => (
                <div>
                  <h3>Subjects</h3>
                  {values.subjects.map((subject, index) => (
                    <div key={index}>
                      <div>
                        <label>Subject Name</label>
                        <Field
                          type="text"
                          name={`subjects.${index}.subjectName`}
                        />
                        <ErrorMessage
                          name={`subjects.${index}.subjectName`}
                          component="div"
                        />
                      </div>
                      <div>
                        <label>Credit Hours</label>
                        <Field
                          type="number"
                          name={`subjects.${index}.creditHours`}
                        />
                        <ErrorMessage
                          name={`subjects.${index}.creditHours`}
                          component="div"
                        />
                      </div>
                      <div>
                        <label>Marks</label>
                        <Field type="number" name={`subjects.${index}.marks`} />
                        <ErrorMessage
                          name={`subjects.${index}.marks`}
                          component="div"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={values.subjects.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => push(initialSubject)}>
                    Add Subject
                  </button>
                  <ErrorMessage name="subjects" component="div" />
                </div>
              )}
            </FieldArray>
            <button type="submit" disabled={isSubmitting}>
              {editMode ? "Update" : "Calculate"} SGPA
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditMode(false);
                setCurrentRecordId(null);
                setSgpa(null);
              }}
            >
              Reset
            </button>
          </Form>
        )}
      </Formik>
      {sgpa && (
        <div>
          <h3>SGPA: {sgpa}</h3>
          {editMode && (
            <button
              onClick={() => {
                setEditMode(false);
                setCurrentRecordId(null);
                setSgpa(null);
              }}
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
