import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { createSurvey } from "../services/surveyService";
import "./CreateSurvey.css";

const templates = [
  { value: "Customer", label: "Customer Feedback", description: "Understand customer satisfaction and product experience." },
  { value: "Employee", label: "Employee Feedback", description: "Collect workplace and team feedback." },
  { value: "Research", label: "Product Research", description: "Explore user needs, preferences, and ideas." },
];

function CreateSurvey() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [startFrom, setStartFrom] = useState("blank");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [configFile, setConfigFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleStartFromChange(value) {
    setStartFrom(value);
    setError("");

    if (value === "template" && selectedTemplate) {
      applyTemplate(selectedTemplate);
    }
  }

  function applyTemplate(value) {
    const template = templates.find((item) => item.value === value);
    if (!template) return;

    setSelectedTemplate(value);
    setCategory(value);
    if (!name.trim()) setName(template.label);
    if (!description.trim()) setDescription(template.description);
  }

  async function handleCreateSurvey(event) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Survey name is required.");
      return;
    }

    if (startFrom === "template" && !selectedTemplate) {
      setError("Please select a template.");
      return;
    }

    if (startFrom === "import") {
      setError("JSON import is shown in this UI, but importing questions is not connected yet. Choose Blank Survey or a template for now.");
      return;
    }

    try {
      setLoading(true);
      const survey = await createSurvey({
        name: name.trim(),
        description: description.trim(),
        category,
      });

      if (!survey?._id) {
        throw new Error("The server response did not include a survey ID.");
      }

      navigate(`/survey/${survey._id}`);
    } catch (err) {
      console.error("Failed to create survey:", err);
      setError(err.response?.data?.message || err.message || "Failed to create survey.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="create-survey-page">
        <header className="create-survey-topbar">
          <div className="create-survey-brand">
            <span className="brand-mark" aria-hidden="true">◉</span>
            <span>Survey Builder</span>
          </div>
          <div className="create-survey-top-actions">
            <button className="button button-secondary" type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button className="button button-primary" type="submit" form="create-survey-form" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </header>

        <section className="create-survey-card">
          <div className="page-eyebrow">NEW SURVEY</div>
          <h1>Create a New Survey</h1>
          <p className="page-intro">Start with a blank survey or use a template to get moving faster.</p>

          <form id="create-survey-form" onSubmit={handleCreateSurvey}>
            <div className="form-field">
              <label htmlFor="survey-name">Survey Name <span>*</span></label>
              <input
                id="survey-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Customer Feedback 2024"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="survey-description">Description <small>(optional)</small></label>
              <textarea
                id="survey-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Short survey to understand customer experience with our product."
                rows={3}
              />
            </div>

            <fieldset className="start-from-fieldset">
              <legend>Start from</legend>

              <label className={`start-option ${startFrom === "blank" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="startFrom"
                  checked={startFrom === "blank"}
                  onChange={() => handleStartFromChange("blank")}
                />
                <span>
                  <strong>Blank Survey</strong>
                  <small>Start with an empty survey and add your own questions.</small>
                </span>
              </label>

              <label className={`start-option ${startFrom === "template" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="startFrom"
                  checked={startFrom === "template"}
                  onChange={() => handleStartFromChange("template")}
                />
                <span>
                  <strong>Use a Template</strong>
                  <small>Start with a suggested survey category.</small>
                </span>
              </label>

              {startFrom === "template" && (
                <div className="template-picker">
                  <label htmlFor="survey-template">Select a template</label>
                  <select
                    id="survey-template"
                    value={selectedTemplate}
                    onChange={(event) => applyTemplate(event.target.value)}
                  >
                    <option value="">Choose a template</option>
                    {templates.map((template) => (
                      <option key={template.value} value={template.value}>{template.label}</option>
                    ))}
                  </select>
                  {selectedTemplate && (
                    <p className="template-description">
                      {templates.find((item) => item.value === selectedTemplate)?.description}
                    </p>
                  )}
                </div>
              )}

              <label className={`start-option ${startFrom === "import" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="startFrom"
                  checked={startFrom === "import"}
                  onChange={() => handleStartFromChange("import")}
                />
                <span>
                  <strong>Import from JSON Config File</strong>
                  <small>Use an existing survey configuration file.</small>
                </span>
              </label>

              {startFrom === "import" && (
                <div className="import-picker">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={(event) => setConfigFile(event.target.files?.[0] || null)}
                  />
                  {configFile && <small>Selected: {configFile.name}</small>}
                  <small className="muted-note">Importing questions from JSON will be enabled in a later iteration.</small>
                </div>
              )}
            </fieldset>

            <div className="form-field category-field">
              <label htmlFor="survey-category">Category</label>
              <select id="survey-category" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="General">General</option>
                <option value="Customer">Customer</option>
                <option value="Employee">Employee</option>
                <option value="Research">Research</option>
              </select>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <div className="create-survey-footer">
              <button className="button button-secondary" type="button" onClick={() => navigate("/")}>Cancel</button>
              <button className="button button-primary" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Survey"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default CreateSurvey;