import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import SGPAForm from "./SGPAForm";
import CGPAForm from "./CGPAForm";
import GPAList from "./GPAList";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("sgpa");

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <Tabs
        className="tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Tab eventKey="sgpa" title="SGPA Calculator">
          <SGPAForm />
        </Tab>
        <Tab eventKey="cgpa" title="CGPA Calculator">
          <CGPAForm />
        </Tab>
        <Tab eventKey="record" title="My Records">
          <GPAList />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Dashboard;
