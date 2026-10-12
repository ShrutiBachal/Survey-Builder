import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import { createSurvey } from "../services/surveyService";

function CreateSurvey() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");

  const [loading, setLoading] = useState(false);

  const handleCreateSurvey = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Survey Name is required");
      return;
    }

    try {
      setLoading(true);

      const survey = await createSurvey({
        name,
        description,
        category,
      });
      console.log("Created Survey:", survey);

      navigate(`/survey/${survey._id}`);
      
    } catch (error) {
      console.error(error);

      alert("Failed to create survey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-survey-container">
        <h1>Create Survey</h1>

        <form onSubmit={handleCreateSurvey}>
          <div>
            <label>Survey Name *</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer Feedback Survey"
            />
          </div>

          <div>
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe your survey"
            />
          </div>

          <div>
            <label>Category</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="General">
                General
              </option>

              <option value="Customer">
                Customer
              </option>

              <option value="Employee">
                Employee
              </option>

              <option value="Research">
                Research
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Survey"}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateSurvey;