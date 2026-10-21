const mongoose = require("mongoose");
const Question = require("../models/Questions");
const Survey = require("../models/Survey");

const validTypes = [
  "shortText",
  "longText",
  "singleChoice",
  "multipleChoice",
  "rating",
];

function validateQuestion(text, type, options) {
  if (typeof text !== "string" || !text.trim()) {
    return "Question text is required.";
  }

  if (!validTypes.includes(type)) {
    return "Invalid question type.";
  }

  if (
    ["singleChoice", "multipleChoice"].includes(type) &&
    (!Array.isArray(options) ||
      options.filter((option) => typeof option === "string" && option.trim()).length < 2)
  ) {
    return "Choice questions require at least two non-empty options.";
  }

  return null;
}

// POST /api/surveys/:surveyId/questions
exports.createQuestion = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const {
      text,
      type = "shortText",
      options = [],
      required = false,
    } = req.body;

    if (!mongoose.isValidObjectId(surveyId)) {
      return res.status(400).json({ message: "Invalid survey ID." });
    }

    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    const validationError = validateQuestion(text, type, options);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (typeof required !== "boolean") {
      return res.status(400).json({
        message: "Required must be true or false.",
      });
    }

    const cleanOptions = Array.isArray(options)
      ? options
          .filter((option) => typeof option === "string")
          .map((option) => option.trim())
          .filter(Boolean)
      : [];

    const order = await Question.countDocuments({ surveyId });

    const question = await Question.create({
      surveyId,
      text: text.trim(),
      type,
      options: cleanOptions,
      required,
      order,
    });

    return res.status(201).json(question);
  } catch (error) {
    console.error("Create question error:", error);
    return res.status(500).json({ message: "Failed to create question." });
  }
};

// GET /api/surveys/:surveyId/questions
exports.getQuestionsBySurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;

    if (!mongoose.isValidObjectId(surveyId)) {
      return res.status(400).json({ message: "Invalid survey ID." });
    }

    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    const questions = await Question.find({ surveyId }).sort({
      order: 1,
      createdAt: 1,
    });

    return res.status(200).json(questions);
  } catch (error) {
    console.error("Get questions error:", error);
    return res.status(500).json({ message: "Failed to fetch questions." });
  }
};

// PUT /api/questions/:id
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid question ID." });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const text =
      req.body.text !== undefined ? req.body.text : question.text;
    const type =
      req.body.type !== undefined ? req.body.type : question.type;
    const options =
      req.body.options !== undefined ? req.body.options : question.options;
    const required =
      req.body.required !== undefined
        ? req.body.required
        : question.required;

    const validationError = validateQuestion(text, type, options);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (typeof required !== "boolean") {
      return res.status(400).json({
        message: "Required must be true or false.",
      });
    }

    question.text = text.trim();
    question.type = type;
    question.options = Array.isArray(options)
      ? options
          .filter((option) => typeof option === "string")
          .map((option) => option.trim())
          .filter(Boolean)
      : [];
    question.required = required;

    await question.save();

    return res.status(200).json(question);
  } catch (error) {
    console.error("Update question error:", error);
    return res.status(500).json({ message: "Failed to update question." });
  }
};

// DELETE /api/questions/:id
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid question ID." });
    }

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res.status(200).json({
      message: "Question deleted successfully.",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    return res.status(500).json({ message: "Failed to delete question." });
  }
};
