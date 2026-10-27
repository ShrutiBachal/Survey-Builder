import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./SurveyBuilder.css";
import {
  getSurveyById,
  getQuestionsBySurvey,
  createQuestion,
  updateQuestion,
  deleteQuestion, } from "../services/surveyService";

const emptyForm = {
  text: "",
  type: "shortText",
  options: ["", ""],
  required: false,
};

const questionTypes = [
  { value: "shortText", label: "Text (Short Answer)", icon: "▤" },
  { value: "longText", label: "Paragraph (Long Answer)", icon: "▧" },
  { value: "singleChoice", label: "Single Select (Radio)", icon: "◉" },
  { value: "multipleChoice", label: "Multi Select (Checkbox)", icon: "☑" },
  { value: "rating", label: "Rating (1–5)", icon: "☆" },
];

function SurveyBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("build");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const needsOptions = ["singleChoice", "multipleChoice"].includes(form.type);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadBuilderData() {
      try {
        const [surveyData, questionData] = await Promise.all([
          getSurveyById(id),
          getQuestionsBySurvey(id),
        ]);
        if (!cancelled) {
          setSurvey(surveyData);
          setQuestions(questionData);
        }
      } catch (err) {
        console.error("Failed to load survey builder:", err);
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load the survey and its questions."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBuilderData();
    return () => { cancelled = true; };
  }, [id]);

  function chooseQuestionType(type) {
    setEditingId(null);
    setForm({
      ...emptyForm,
      type,
      options: ["singleChoice", "multipleChoice"].includes(type) ? ["", ""] : [],
    });
    setError("");
    setMessage("");
    setActiveTab("build");
    document.getElementById("question-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleFormChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "type" && !["singleChoice", "multipleChoice"].includes(value) ? { options: [] } : {}),
      ...(name === "type" && ["singleChoice", "multipleChoice"].includes(value) && previous.options.length === 0 ? { options: ["", ""] } : {}),
    }));
  }

  function handleOptionChange(index, value) {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, i) => i === index ? value : option),
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.text.trim()) {
      setError("Enter the question text.");
      return;
    }

    const options = needsOptions
      ? form.options.map((option) => option.trim()).filter(Boolean)
      : [];

    if (needsOptions && options.length < 2) {
      setError("Choice questions require at least two non-empty options.");
      return;
    }

    const questionData = {
      text: form.text.trim(),
      type: form.type,
      options,
      required: form.required,
    };

    try {
      setSaving(true);
      if (editingId) {
        const updated = await updateQuestion(editingId, questionData);
        setQuestions((previous) => previous.map((question) => question._id === editingId ? updated : question));
        setMessage("Question updated successfully.");
      } else {
        const created = await createQuestion(id, questionData);
        setQuestions((previous) => [...previous, created]);
        setMessage("Question added successfully.");
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      console.error("Question save failed:", err);
      setError(err.response?.data?.message || "Unable to save the question.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(question) {
    setEditingId(question._id);
    setForm({
      text: question.text,
      type: question.type,
      options: ["singleChoice", "multipleChoice"].includes(question.type) ? [...question.options] : [],
      required: question.required,
    });
    setActiveTab("build");
    setError("");
    setMessage("");
    document.getElementById("question-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleDelete(questionId) {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    setError("");
    setMessage("");
    try {
      await deleteQuestion(questionId);
      setQuestions((previous) => previous.filter((question) => question._id !== questionId));
      if (editingId === questionId) {
        setForm(emptyForm);
        setEditingId(null);
      }
      setMessage("Question deleted successfully.");
    } catch (err) {
      console.error("Question deletion failed:", err);
      setError(err.response?.data?.message || "Unable to delete the question.");
    }
  }

  function handleSaveSurvey() {
    // Question changes are persisted as each question is added or edited.
    setMessage("Your survey changes are saved.");
  }

  if (loading) {
    return <><Navbar /><main className="sb-shell"><p className="sb-state">Loading survey...</p></main></>;
  }

  if (error && !survey) {
    return <><Navbar /><main className="sb-shell"><p className="sb-alert" role="alert">{error}</p></main></>;
  }

  if (!survey) {
    return <><Navbar /><main className="sb-shell"><p className="sb-state">Survey not found.</p></main></>;
  }

  return (
    <>
      <Navbar />
      <main className="sb-shell">
        <header className="sb-topbar">
          <div className="sb-brand"><span className="sb-brand-icon">◉</span><span>Survey Builder</span></div>
          <button className="sb-link-button" type="button" onClick={() => navigate("/")}>← Back to Surveys</button>
        </header>

        <section className="sb-survey-heading">
          <div>
            <p className="sb-eyebrow">SURVEY EDITOR</p>
            <h1>{survey.name}</h1>
            <p className="sb-description">{survey.description || "Add a description to explain the purpose of this survey."}</p>
          </div>
          <div className="sb-heading-actions">
            <button className="sb-button sb-button-secondary" type="button" onClick={handleSaveSurvey}>Save</button>
            <button className="sb-button sb-button-primary" type="button" onClick={() => setActiveTab("preview")}>Preview</button>
          </div>
        </section>

        <nav className="sb-tabs" aria-label="Survey editor tabs">
          <button className={activeTab === "build" ? "active" : ""} onClick={() => setActiveTab("build")} type="button">Build</button>
          <button className={activeTab === "preview" ? "active" : ""} onClick={() => setActiveTab("preview")} type="button">Preview</button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")} type="button">Settings</button>
        </nav>

        {error && <p className="sb-alert" role="alert">{error}</p>}
        {message && <p className="sb-success" role="status">{message}</p>}

        {activeTab === "build" && (
          <div className="sb-builder-layout">
            <aside className="sb-add-panel">
              <h2>Add Question</h2>
              <p className="sb-panel-hint">Choose a type to add a question.</p>
              <div className="sb-type-list">
                {questionTypes.map((type) => (
                  <button key={type.value} type="button" className="sb-type-button" onClick={() => chooseQuestionType(type.value)}>
                    <span className="sb-type-icon">{type.icon}</span><span>{type.label}</span><span className="sb-type-plus">+</span>
                  </button>
                ))}
              </div>
              <div className="sb-tip"><strong>Tip</strong><p>Keep questions clear and focused. Mark a question as required when an answer is essential.</p></div>
            </aside>

            <section className="sb-question-column">
              <div className="sb-section-heading">
                <div><h2>Questions</h2><span>{questions.length} question{questions.length === 1 ? "" : "s"}</span></div>
              </div>

              <section className="sb-question-form-card" id="question-form">
                <div className="sb-form-card-heading">
                  <div><span className="sb-step-badge">{editingId ? "✎" : "+"}</span><h3>{editingId ? "Edit Question" : "New Question"}</h3></div>
                  {editingId && <button type="button" className="sb-text-button" onClick={resetForm}>Cancel edit</button>}
                </div>
                <form onSubmit={handleSubmit}>
                  <label htmlFor="question-text">Question text <span className="sb-required">*</span></label>
                  <textarea id="question-text" name="text" value={form.text} onChange={handleFormChange} placeholder="Type your question here..." rows={2} required />

                  <div className="sb-form-row">
                    <div className="sb-field-grow">
                      <label htmlFor="question-type">Question type</label>
                      <select id="question-type" name="type" value={form.type} onChange={handleFormChange}>
                        {questionTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                      </select>
                    </div>
                    <label className="sb-required-toggle">
                      <input type="checkbox" name="required" checked={form.required} onChange={handleFormChange} />
                      Required
                    </label>
                  </div>

                  {needsOptions && (
                    <div className="sb-options-editor">
                      <div className="sb-options-heading"><h4>Answer options</h4><span>{form.options.length} options</span></div>
                      {form.options.map((option, index) => (
                        <div className="sb-option-row" key={index}>
                          <span className={form.type === "singleChoice" ? "sb-radio-preview" : "sb-checkbox-preview"} aria-hidden="true" />
                          <input value={option} onChange={(event) => handleOptionChange(index, event.target.value)} placeholder={`Option ${index + 1}`} aria-label={`Option ${index + 1}`} />
                          <button type="button" className="sb-icon-button" aria-label={`Remove option ${index + 1}`} disabled={form.options.length <= 2} onClick={() => setForm((previous) => ({ ...previous, options: previous.options.filter((_, i) => i !== index) }))}>×</button>
                        </div>
                      ))}
                      <button className="sb-text-button" type="button" onClick={() => setForm((previous) => ({ ...previous, options: [...previous.options, ""] }))}>+ Add option</button>
                    </div>
                  )}

                  {form.type === "rating" && (
                    <div className="sb-rating-editor">
                      <h4>Rating scale preview</h4>
                      <div className="sb-rating-preview" aria-label="Rating scale from 1 to 5">
                        {[1, 2, 3, 4, 5].map((rating) => <span key={rating}>{rating}</span>)}
                      </div>
                      <p>Rating scale is currently 1–5.</p>
                    </div>
                  )}

                  <div className="sb-form-actions">
                    <button type="button" className="sb-button sb-button-secondary" onClick={resetForm}>Clear</button>
                    <button type="submit" className="sb-button sb-button-primary" disabled={saving}>{saving ? "Saving..." : editingId ? "Save Changes" : "Add Question"}</button>
                  </div>
                </form>
              </section>

              {questions.length === 0 ? (
                <div className="sb-empty-state"><span className="sb-empty-icon">＋</span><h3>No questions yet</h3><p>Choose a question type or use the form above to add your first question.</p></div>
              ) : (
                <div className="sb-question-list">
                  {questions.map((question, index) => (
                    <article className="sb-question-card" key={question._id}>
                      <span className="sb-drag-handle" aria-hidden="true">⠿</span>
                      <div className="sb-question-content">
                        <div className="sb-question-title-row"><h3>{index + 1}. {question.text}{question.required && <span className="sb-required-star"> *</span>}</h3><span className="sb-question-type-pill">{questionTypes.find((type) => type.value === question.type)?.label || question.type}</span></div>
                        {question.options?.length > 0 && <ul className="sb-saved-options">{question.options.map((option, optionIndex) => <li key={`${question._id}-${optionIndex}`}>{question.type === "singleChoice" ? "○" : "□"} <span>{option}</span></li>)}</ul>}
                        {question.type === "rating" && <div className="sb-saved-rating" aria-label="Rating preview">{[1, 2, 3, 4, 5].map((rating) => <span key={rating}>☆</span>)}</div>}
                        {question.type === "shortText" && <div className="sb-answer-placeholder">Short answer text</div>}
                        {question.type === "longText" && <div className="sb-answer-placeholder sb-long-answer">Long answer text</div>}
                      </div>
                      <div className="sb-question-actions">
                        <button type="button" className="sb-icon-button" aria-label={`Edit question ${index + 1}`} onClick={() => handleEdit(question)}>✎</button>
                        <button type="button" className="sb-icon-button sb-delete-button" aria-label={`Delete question ${index + 1}`} onClick={() => handleDelete(question._id)}>⌫</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <button type="button" className="sb-add-question-bottom" onClick={() => chooseQuestionType("shortText")}>＋ <span>Add Question</span></button>
            </section>
          </div>
        )}

        {activeTab === "preview" && (
          <section className="sb-preview-page">
            <div className="sb-preview-sheet">
              <div className="sb-preview-banner" />
              <h2>{survey.name}</h2>
              <p className="sb-preview-description">{survey.description}</p>
              {questions.length === 0 ? <p className="sb-muted">No questions have been added yet.</p> : questions.map((question, index) => (
                <div className="sb-respondent-question" key={question._id}>
                  <label>{index + 1}. {question.text}{question.required && <span className="sb-required-star"> *</span>}</label>
                  {question.type === "shortText" && <input type="text" placeholder="Your answer" />}
                  {question.type === "longText" && <textarea placeholder="Your answer" rows={3} />}
                  {question.type === "singleChoice" && <div className="sb-respondent-options">{question.options.map((option, i) => <label key={i}><input type="radio" name={`preview-${question._id}`} />{option}</label>)}</div>}
                  {question.type === "multipleChoice" && <div className="sb-respondent-options">{question.options.map((option, i) => <label key={i}><input type="checkbox" />{option}</label>)}</div>}
                  {question.type === "rating" && <div className="sb-respondent-rating">{[1, 2, 3, 4, 5].map((rating) => <label key={rating}><input type="radio" name={`rating-${question._id}`} /><span>{rating}</span></label>)}</div>}
                </div>
              ))}
              <p className="sb-preview-note">Preview only — responses are not submitted or stored yet.</p>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="sb-settings-panel">
            <div><h2>Survey settings</h2><p>Survey information currently saved in your database.</p></div>
            <div className="sb-settings-field"><span>Survey name</span><strong>{survey.name}</strong></div>
            <div className="sb-settings-field"><span>Description</span><strong>{survey.description || "No description"}</strong></div>
            <div className="sb-settings-field"><span>Category</span><strong>{survey.category}</strong></div>
            <div className="sb-settings-field"><span>Status</span><strong>{survey.status}</strong></div>
            <p className="sb-muted">Editing survey metadata and advanced settings can be added in a later iteration.</p>
          </section>
        )}
      </main>
    </>
  );
}

export default SurveyBuilder;