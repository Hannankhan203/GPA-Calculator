import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import SGPAForm from "./SGPAForm";
import CGPAForm from "./CGPAForm";
import GPAList from "./GPAList";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("sgpa");

  return (
    <div>
      <h2>Dashboard</h2>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="sgpa" title="SGPA Calculator">
          <SGPAForm />
        </Tab>
        <Tab eventKey="cgpa" title="CGPA Calculator">
          <CGPAForm />
        </Tab>
        <Tab eventKey="records" title="My Records">
          <GPAList />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Dashboard;
