import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SurveyBuilder from "./pages/SurveyBuilder";
import CreateSurvey from "./pages/CreateSurvey";
import TestApi from "./pages/TestApi";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/survey/:id" element={<SurveyBuilder />} />
        <Route path="/create-survey" element={<CreateSurvey />} />
        <Route path="/test" element={<TestApi />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;