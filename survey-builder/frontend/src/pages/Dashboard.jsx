import { useEffect, useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import HeroSection from "../components/Dashboard/HeroSection";
import SurveyTable from "../components/Dashboard/SurveyTable";
import { getAllSurveys } from "../services/surveyService";

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

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <HeroSection />

        {loading && <p>Loading surveys...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <SurveyTable surveys={surveys} />
        )}
      </div>
    </>
  );
}

export default Dashboard;