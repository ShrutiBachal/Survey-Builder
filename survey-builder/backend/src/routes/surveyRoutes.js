const express = require("express");

const {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
} = require("../controllers/surveyController");

const router = express.Router();

router.post("/", createSurvey);

router.get("/", getAllSurveys);

router.get("/:id", getSurveyById);

router.put("/:id", updateSurvey);

router.delete("/:id", deleteSurvey);

module.exports = router;