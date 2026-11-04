import { useEffect, useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import HeroSection from "../components/Dashboard/HeroSection";
import SurveyTable from "../components/Dashboard/SurveyTable";
import { getAllSurveys } from "../services/surveyService";
import { deleteSurvey } from "../services/surveyService";


import "../components/Dashboard/Dashboard.css";

function Dashboard() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
    try {
          const data = await getAllSurveys();
          setSurveys(data);
          setError("");
        } catch {
          setError("Failed to load surveys");
        } finally {
          setLoading(false);
        }
    }

    fetchSurveys();
  }, []);

  const handleDelete = async (surveyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this survey?"
    );

    if (!confirmDelete) return;

    try {
      await deleteSurvey(surveyId);

      // Remove the deleted survey from the UI
      setSurveys((prevSurveys) =>
        prevSurveys.filter((survey) => survey._id !== surveyId)
      );

      alert("Survey deleted successfully!");
    } catch (error) {
      console.error(
        "Delete survey error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete survey. Please try again."
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <HeroSection />

        {loading && <p>Loading surveys...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <SurveyTable 
            surveys={surveys} 
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
}

export default Dashboard;