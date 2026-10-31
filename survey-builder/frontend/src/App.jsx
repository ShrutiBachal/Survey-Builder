import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SurveyBuilder from "./pages/SurveyBuilder";
import CreateSurvey from "./pages/CreateSurvey";
import TestApi from "./pages/TestApi";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/survey/:id" element={<SurveyBuilder />} />
          <Route path="/create-survey" element={<CreateSurvey />} />
          <Route path="/test" element={<TestApi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;