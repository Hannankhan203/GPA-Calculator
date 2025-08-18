import { useState } from "react";
import SGPAForm from "./SGPAForm";
import CGPAForm from "./CGPAForm";
import GPAList from "./GPAList";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("sgpa");

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">GPA Dashboard</h2>
      </div>
      
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "sgpa" ? "active" : ""}`}
          onClick={() => setActiveTab("sgpa")}
        >
          SGPA Calculator
        </button>
        <button
          className={`tab-btn ${activeTab === "cgpa" ? "active" : ""}`}
          onClick={() => setActiveTab("cgpa")}
        >
          CGPA Calculator
        </button>
        <button
          className={`tab-btn ${activeTab === "records" ? "active" : ""}`}
          onClick={() => setActiveTab("records")}
        >
          My Records
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "sgpa" && <SGPAForm />}
        {activeTab === "cgpa" && <CGPAForm />}
        {activeTab === "records" && <GPAList />}
      </div>
    </div>
  );
};

export default Dashboard;