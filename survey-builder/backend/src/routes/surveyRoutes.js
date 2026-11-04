const express = require("express");

const {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
} = require("../controllers/surveyController");

const { requireAuth } = require("../middleware/authMiddleware");
const  allowRoles  = require("../middleware/roleMiddleware");

const router = express.Router();

// Both Admin and User can view surveys
router.get("/", requireAuth, getAllSurveys);
router.get("/:id", requireAuth, getSurveyById);

// Only Admin can manage surveys
router.post("/", requireAuth, allowRoles("Admin"), createSurvey);
router.put("/:id", requireAuth, allowRoles("Admin"), updateSurvey);
router.delete("/:id", requireAuth, allowRoles("Admin"), deleteSurvey);

module.exports = router;