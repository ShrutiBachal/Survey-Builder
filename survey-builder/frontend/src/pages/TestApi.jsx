import { useState } from "react";
import { createSurvey } from "../services/surveyService";

function TestApi() {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    try {
      const survey = await createSurvey({
        name,
        description: "Created from React",
        category: "Testing",
      });

      console.log(survey);

      alert("Survey Created Successfully");
    } catch (error) {
      console.error(error);

      alert("Failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>API Test Page</h1>

      <input
        type="text"
        placeholder="Survey Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Create Survey
      </button>
    </div>
  );
}

export default TestApi;