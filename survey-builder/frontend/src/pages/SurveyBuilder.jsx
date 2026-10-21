import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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

function SurveyBuilder() {
  const { id } = useParams();
  console.log("Route ID:", id);

  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const needsOptions = ["singleChoice", "multipleChoice"].includes(
    form.type
  );


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
      // console.error("API response:", err.response?.data);
      // console.error("Request URL:", err.config?.url);

      if (!cancelled) {
        setError(
          err.response?.data?.message ||
            `Request failed: ${err.response?.status || err.message}`
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadBuilderData();

  return () => {
    cancelled = true;
  };
}, [id]);

function handleFormChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "type" &&
      !["singleChoice", "multipleChoice"].includes(value)
        ? { options: [] }
        : {}),
      ...(name === "type" &&
      ["singleChoice", "multipleChoice"].includes(value) &&
      previous.options.length === 0
        ? { options: ["", ""] }
        : {}),
    }));
  }

  function handleOptionChange(index, value) {
    setForm((previous) => ({
      ...previous,
      options: previous.options.map((option, optionIndex) =>
        optionIndex === index ? value : option
      ),
    }));
  }

  function addOption() {
    setForm((previous) => ({
      ...previous,
      options: [...previous.options, ""],
    }));
  }

  function removeOption(index) {
    setForm((previous) => ({
      ...previous,
      options: previous.options.filter(
        (_, optionIndex) => optionIndex !== index
      ),
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.text.trim()) {
      setError("Enter the question text.");
      return;
    }

    const options = needsOptions
      ? form.options.map((option) => option.trim()).filter(Boolean)
      : [];

    if (needsOptions && options.length < 2) {
      setError("Add at least two non-empty answer options.");
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
        const updatedQuestion = await updateQuestion(
          editingId,
          questionData
        );

        setQuestions((previous) =>
          previous.map((question) =>
            question._id === editingId
              ? updatedQuestion
              : question
          )
        );

        setMessage("Question updated successfully.");
      } else {
        const newQuestion = await createQuestion(id, questionData);

        setQuestions((previous) => [...previous, newQuestion]);

        setMessage("Question added successfully.");
      }

      resetForm();
    } catch (err) {
      console.error("Question save failed:", err);
      setError(
        err.response?.data?.message || "Unable to save the question."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(question) {
    setEditingId(question._id);
    setForm({
      text: question.text,
      type: question.type,
      options: ["singleChoice", "multipleChoice"].includes(question.type)
        ? [...question.options]
        : ["", ""],
      required: question.required,
    });
    setError("");
    setMessage("");
  }

  async function handleDelete(questionId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteQuestion(questionId);

      setQuestions((previous) =>
        previous.filter((question) => question._id !== questionId)
      );

      if (editingId === questionId) {
        resetForm();
      }

      setMessage("Question deleted successfully.");
    } catch (err) {
      console.error("Question deletion failed:", err);
      setError(
        err.response?.data?.message || "Unable to delete the question."
      );
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="survey-builder">
          <p>Loading survey...</p>
        </main>
      </>
    );
  }

  if (error && !survey) {
    return (
      <>
        <Navbar />
        <main className="survey-builder">
          <p role="alert">{error}</p>
        </main>
      </>
    );
  }

  if (!survey) {
    return (
      <>
        <Navbar />
        <main className="survey-builder">
          <p>Survey not found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="survey-builder">
        <section className="survey-details">
          <h1>{survey.name}</h1>
          <p>{survey.description || "No description provided."}</p>
          <p>Category: {survey.category}</p>
          <p>Status: {survey.status}</p>
        </section>

        <section className="question-editor">
          <h2>{editingId ? "Edit Question" : "Add a Question"}</h2>

          {error && <p role="alert">{error}</p>}
          {message && <p role="status">{message}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="question-text">Question text</label>
            <textarea
              id="question-text"
              name="text"
              value={form.text}
              onChange={handleFormChange}
              placeholder="Enter your question"
              required
            />

            <label htmlFor="question-type">Question type</label>
            <select
              id="question-type"
              name="type"
              value={form.type}
              onChange={handleFormChange}
            >
              <option value="shortText">Short text</option>
              <option value="longText">Long text</option>
              <option value="singleChoice">Single choice</option>
              <option value="multipleChoice">Multiple choice</option>
              <option value="rating">Rating</option>
            </select>

            {needsOptions && (
              <div className="question-options">
                <h3>Answer options</h3>

                {form.options.map((option, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={option}
                      onChange={(event) =>
                        handleOptionChange(index, event.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      disabled={form.options.length <= 2}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button type="button" onClick={addOption}>
                  Add option
                </button>
              </div>
            )}

            <label>
              <input
                type="checkbox"
                name="required"
                checked={form.required}
                onChange={handleFormChange}
              />
              Required question
            </label>

            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Add Question"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm} disabled={saving}>
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        <section className="question-list">
          <h2>Survey Questions ({questions.length})</h2>

          {questions.length === 0 ? (
            <p>No questions added yet.</p>
          ) : (
            questions.map((question, index) => (
              <article key={question._id} className="question-card">
                <h3>
                  {index + 1}. {question.text}
                  {question.required && " *"}
                </h3>

                <p>Type: {question.type}</p>

                {question.options?.length > 0 && (
                  <ul>
                    {question.options.map((option, optionIndex) => (
                      <li key={`${question._id}-${optionIndex}`}>
                        {option}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  onClick={() => handleEdit(question)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(question._id)}
                >
                  Delete
                </button>
              </article>
            ))
          )}
        </section>
      </main>
    </>
  );
}

export default SurveyBuilder;