const express = require("express");
const cors = require("cors");

const surveyRoutes = require("./routes/surveyRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Survey Builder API Running");
});


app.use("/api/surveys", surveyRoutes);
app.use("/api", questionRoutes);

module.exports = app;