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
  studentName: "",
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
  const [currentRecord, setCurrentRecord] = useState(null);

  const calculateCGPA = (semesters) => {
    let totalCreditHours = 0;
    let totalWeightedSGPA = 0;

    semesters.forEach((semester) => {
      totalCreditHours += parseFloat(semester.creditHours);
      totalWeightedSGPA +=
        parseFloat(semester.creditHours) * parseFloat(semester.sgpa);
    });

    return (totalWeightedSGPA / totalCreditHours).toFixed(2);
  };

  const onSubmit = async (values, { resetForm }) => {
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
    setCgpa(record.cgpa);
  };

  return (
    <div>
      <Formik
        initialValues={
          editMode
            ? {
                studentName: currentRecord?.studentName || "",
                semesters: currentRecord?.semesters || [initialSemester],
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
            <FieldArray name="semesters">
              {({ push, remove }) => (
                <div>
                  <h3>Semesters</h3>
                  {values.semesters.map((semester, index) => (
                    <div key={index}>
                      <div>
                        <label>Semester Name</label>
                        <Field
                          type="text"
                          name={`semesters.${index}.semesterName`}
                        />
                        <ErrorMessage
                          name={`semesters.${index}.semesterName`}
                          component="div"
                        />
                      </div>
                      <div>
                        <label>Credit Hours</label>
                        <Field
                          type="number"
                          name={`semesters.${index}.creditHours`}
                        />
                        <ErrorMessage
                          name={`semesters.${index}.creditHours`}
                          component="div"
                        />
                      </div>
                      <div>
                        <label>SGPA</label>
                        <Field
                          type="number"
                          step="0.01"
                          name={`semesters.${index}.sgpa`}
                        />
                        <ErrorMessage
                          name={`semesters.${index}.sgpa`}
                          component="div"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={values.semesters.length <= 1}
                      >
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
            <button type="submit" disabled={isSubmitting}>
              {editMode ? "Update" : "Calculate"} CGPA
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditMode(false);
                setCurrentRecordId(null);
                setCgpa(null);
              }}
            >
              Reset
            </button>
          </Form>
        )}
      </Formik>
      {cgpa && (
        <div>
          <h3>CGPA: {cgpa}</h3>
          {editMode && (
            <button
              onClick={() => {
                setEditMode(false);
                setCurrentRecordId(null);
                setCgpa(null);
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

export default CGPAForm;
