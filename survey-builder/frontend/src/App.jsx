import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SurveyBuilder from "./pages/SurveyBuilder";
import CreateSurvey from "./pages/CreateSurvey";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/survey/:id" element={<SurveyBuilder />} />
        <Route path="/create-survey" element={<CreateSurvey />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;