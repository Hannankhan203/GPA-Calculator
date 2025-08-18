import { useState, useEffect } from "react";
import { useAuthStore } from "../../context/store";
import {
  db,
  collection,
  getDocs,
  doc,
  deleteDoc,
  where,
  query,
} from "../../firebase";

const GPAList = () => {
  const { user } = useAuthStore();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "gpaRecords"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const recordsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(recordsData);
      } catch (error) {
        console.error("Error fetching records", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "gpaRecords", id));
      setRecords(records.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error deleting record", error);
    }
  };

  const handleEditRecord = (record) => {
    console.log("Edit record:", record);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="gpa-records-container">
      <h3 className="records-title">My GPA Records</h3>
      {records.length === 0 ? (
        <div className="no-records">No records found</div>
      ) : (
        <ul className="records-list">
          {records.map((record) => (
            <li key={record.id} className="record-card">
              <div className="record-field">
                <strong className="field-label">Student: </strong>
                <span className="field-value">{record.studentName}</span>
              </div>
              {record.type === "sgpa" ? (
                <>
                  <div className="record-field">
                    <strong className="field-label">Semester: </strong>
                    <span className="field-value">{record.semester}</span>
                  </div>
                  <div className="record-field">
                    <strong className="field-label">SGPA: </strong>
                    <span className="field-value highlight">{record.sgpa}</span>
                  </div>
                </>
              ) : (
                <div className="record-field">
                  <strong className="field-label">CGPA: </strong>
                  <span className="field-value highlight">{record.cgpa}</span>
                </div>
              )}
              <div className="record-field">
                <strong className="field-label">Date: </strong>
                <span className="field-value">
                  {record.createdAt?.toDate().toLocaleString()}
                </span>
              </div>
              <div className="record-actions">
                <button 
                  onClick={() => handleEditRecord(record)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(record.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GPAList;