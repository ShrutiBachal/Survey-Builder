const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getQuestionsBySurvey,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

router.post("/surveys/:surveyId/questions", createQuestion);
router.get("/surveys/:surveyId/questions", getQuestionsBySurvey);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

module.exports = router;
