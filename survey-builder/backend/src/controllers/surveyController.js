const Survey = require("../models/Survey");

// Create a new survey
const createSurvey = async (req, res) => {
  try {
    const survey = await Survey.create(req.body);

    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all surveys
const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();

    res.json(surveys);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get a survey by ID
const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({
        message: "Survey not found",
      });
    }
    res.json(survey);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update a survey
const updateSurvey = async (req, res) => { 
    try {
        const survey = await Survey.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!survey) {
            return res.status(404).json({
                message: "Survey not found",
            });
        }

        res.json(survey);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete a survey
const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findByIdAndDelete(req.params.id);

    if (!survey) {
      return res.status(404).json({
        message: "Survey not found",
      });
    }

    res.json({
      message: "Survey deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
};