import { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { db, doc, setDoc, collection, addDoc } from "../../firebase";
import { useAuthStore } from "../../context/store";

const initialSemester = {
  semesterName: "",
  creditHours: "",
  sgpa: "",
};

const initialValues = {
  studentNam: "",
  semesters: [initialSemester],
};

const validationSchema = Yup.object({
  studentName: Yup.string().required("Required"),
  semesters: Yup.array()
    .of(
      Yup.object().shape({
        semesterName: Yup.string().required("Required"),
        creditHours: Yup.number()
          .required("Required")
          .positive("Must be positive"),
        sgpa: Yup.number()
          .required("Required")
          .min(0, "Must be between 0-4")
          .max(4, "Must be between 0-4"),
      })
    )
    .min(2, "Minimum 2 semesters required"),
});

const CGPAForm = () => {
  const { user } = useAuthStore();
  const [cgpa, setCgpa] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null);

  const calculateCGPA = (semesters) => {
    let totalCreditHours = 0;
    let totalWeightedCGPA = 0;

    semesters.forEach((semester) => {
      totalCreditHours = parseFloat(semester.creditHours);
      totalWeightedCGPA =
        parseFloat(semester.creditHours) * parseFloat(semester.sgpa);
    });

    return (totalWeightedCGPA / totalCreditHours).toFixed(2);
  };

  const onSubmit = async (validateYupSchema, { resetForm }) => {
    const calculatedCGPA = calculateCGPA(values.semesters);
    setCgpa(calculatedCGPA);

    const recordData = {
      studentName: values.studentName,
      semesters: values.semesters,
      cgpa: calculatedCGPA,
      type: "cgpa",
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
      console.error("Error saving record", error);
    }
  };

  const handleEditRecord = (record) => {
    setEditMode(true);
    setCurrentRecordId(record.id);
    setCgpa(record.cgpa);
    return {
      studentName: record.studentName,
      semesters: record.semesters,
    };
  };

  return (
    <div className="gpa-container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={editMode}
      >
        {({ values }) => (
          <Form className="gpa-form">
            <div className="gpa-form-group">
              <label htmlFor="studentName">Student Name:</label>
              <Field type="text" name="studentName" />
              <ErrorMessage name="studentName" component="div" />
            </div>
            <FieldArray name="semesters">
              {({ push, remove }) => (
                <div>
                  <h3>Semesters</h3>
                  {values.semesters.map((semester, index) => (
                    <div key={index}>
                      <div className="gpa-form-group">
                        <label htmlFor="semesterName">Semester Name:</label>
                        <Field
                          type="text"
                          name={`semesters.${index}.semesterName`}
                        />
                        <ErrorMessage
                          name={`semesters.${index}.semesterName`}
                          component="div"
                        />
                      </div>
                      <div className="gpa-form-group">
                        <label htmlFor="creditHours">Credit Hours:</label>
                        <Field
                          type="number"
                          name={`semesters.${index}.creditHours`}
                        />
                        <ErrorMessage
                          name={`semesters.${index}.creditHours`}
                          component="div"
                        />
                      </div>
                      <div className="gpa-form-group">
                        <label htmlFor="sgpa">SGPA</label>
                        <Field
                          type="number"
                          step="0.01"
                          name={`semester.${index}.sgpa`}
                        />
                        <ErrorMessage
                          name={`semesters.${index}.sgpa`}
                          component="div"
                        />
                      </div>
                      <button type="button" onClick={() => remove(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => push(initialSemester)}>
                    Add Semester
                  </button>
                  <ErrorMessage name="semesters" component="div" />
                </div>
              )}
            </FieldArray>
            <button type="submit">Calculate CGPA</button>
            <button type="button" onClick={() => resetForm()}>
              Reset
            </button>
          </Form>
        )}
      </Formik>
      {cgpa && (
        <div>
          <h3>CGPA: {cgpa}</h3>
          <button onClick={() => handleEditRecord(currentRecordId)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default CGPAForm;
