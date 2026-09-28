const express = require("express");
const cors = require("cors");

const surveyRoutes = require("./routes/surveyRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Survey Builder API Running");
});

app.use("/api/surveys", surveyRoutes);

module.exports = app;