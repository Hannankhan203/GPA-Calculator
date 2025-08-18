import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import SGPAForm from "./SGPAForm";
import CGPAForm from "./CGPAForm";
import GPAList from "./GPAList";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("sgpa");

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">GPA Dashboard</h2>
        <p className="dashboard-subtitle">
          Track and calculate your academic performance
        </p>
      </div>

      <div className="dashboard-tabs">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="custom-tabs"
        >
          <Tab
            eventKey="sgpa"
            title={<span className="tab-title">SGPA Calculator</span>}
          >
            {activeTab === "sgpa" && (
              <div className="tab-content">
                <SGPAForm />
              </div>
            )}
          </Tab>
          <Tab
            eventKey="cgpa"
            title={<span className="tab-title">CGPA Calculator</span>}
          >
            {activeTab === "cgpa" && (
              <div className="tab-content">
                <CGPAForm />
              </div>
            )}
          </Tab>
          <Tab
            eventKey="records"
            title={<span className="tab-title">My Records</span>}
          >
            {activeTab === "records" && (
              <div className="tab-content">
                <GPAList />
              </div>
            )}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;