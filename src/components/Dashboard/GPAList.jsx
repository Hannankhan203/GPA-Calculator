import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { useAuthStore } from "../../context/store";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

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
        console.error("Error fetching records:", error);
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
      console.error("Error deleting record:", error);
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="records-container">
      <h3 className="records-title">My GPA Records</h3>
      {records.length === 0 ? (
        <div className="empty-message">No records found</div>
      ) : (
        <div className="records-grid">
          {records.map((record) => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <h4 className="student-name">{record.studentName}</h4>
                <span className={`record-type ${record.type}`}>
                  {record.type.toUpperCase()}
                </span>
              </div>
              
              <div className="record-details">
                {record.type === "sgpa" ? (
                  <>
                    <div className="detail-item">
                      <span className="detail-label">Semester:</span>
                      <span className="detail-value">{record.semester}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SGPA:</span>
                      <span className="detail-value highlight">{record.sgpa}</span>
                    </div>
                  </>
                ) : (
                  <div className="detail-item">
                    <span className="detail-label">CGPA:</span>
                    <span className="detail-value highlight">{record.cgpa}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {record.createdAt.toDate().toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="record-actions">
                <button 
                  onClick={() => handleEditRecord(record)}
                  className="action-button edit-button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(record.id)}
                  className="action-button delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GPAList;