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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>My GPA Records</h3>
      {records.length === 0 ? (
        <div>No records found</div>
      ) : (
        <ul className="gpa-list">
          {records.map((record) => (
            <li key={record.id}>
              <div>
                <strong>Student: </strong>
                {record.studentName}
              </div>
              {record.type === "sgpa" ? (
                <>
                  <div>
                    <strong>Semester: </strong>
                    {record.semester}
                  </div>
                  <div>
                    <strong>SGPA: </strong>
                    {record.sgpa}
                  </div>
                </>
              ) : (
                <div>
                  <strong>CGPA: </strong>
                    {record.cgpa}
                </div>
              )}
              <div>
                <strong>Date: </strong>
                {record.createdAt?.toDate().toLocaleString()}
              </div>
              <button onClick={() => handleEditRecord(record)}>Edit</button>
              <button onClick={() => handleDelete(record.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GPAList;