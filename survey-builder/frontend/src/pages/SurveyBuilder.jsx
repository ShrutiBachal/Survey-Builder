import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSurveyById } from "../services/surveyService";

function SurveyBuilder() {
  const { id } = useParams();
  console.log("Route ID:", id);

  const [survey, setSurvey] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const data = await getSurveyById(id);

        setSurvey(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [id]);

  if (loading) {
    return <p>Loading Survey...</p>;
  }

  if (!survey) {
    return <p>Survey not found</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Survey Builder</h1>

      <h2>{survey.name}</h2>

      <p>{survey.description}</p>

      <p>
        Category: {survey.category}
      </p>

      <hr />

      <h3>
        Question Builder Coming In Sprint 4
      </h3>
    </div>
  );
}

export default SurveyBuilder;