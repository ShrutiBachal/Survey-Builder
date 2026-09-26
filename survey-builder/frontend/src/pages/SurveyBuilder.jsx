import { useParams } from "react-router-dom";

function SurveyBuilder() {
  const { id } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Survey Builder</h1>

      <p>Survey ID: {id}</p>

      <p>
        Question Builder UI will be implemented here.
      </p>
    </div>
  );
}

export default SurveyBuilder;