import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SurveyBuilder from "./pages/SurveyBuilder";
import CreateSurvey from "./pages/CreateSurvey";
import TestApi from "./pages/TestApi";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Routes available to both roles */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* Routes available only to Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/create-survey" element={<CreateSurvey />} />
            <Route path="/survey/:id" element={<SurveyBuilder />} />
            <Route path="/test" element={<TestApi />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;