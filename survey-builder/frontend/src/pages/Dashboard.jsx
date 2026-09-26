import Navbar from "../components/Navbar/Navbar";
import HeroSection from "../components/Dashboard/HeroSection";
import SurveyTable from "../components/Dashboard/SurveyTable";

import mockSurveys from "../data/mockSurveys";

import "../components/Dashboard/Dashboard.css";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="dashboard">
        <HeroSection />
        <SurveyTable surveys={mockSurveys} />
      </div>
    </>
  );
}

export default Dashboard;