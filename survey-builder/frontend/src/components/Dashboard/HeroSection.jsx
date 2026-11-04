import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";


function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  return (
    <div className="hero">
      <h1>Welcome to Survey Builder</h1>

      <p>Create engaging surveys with the help of AI.</p>

      <div className="hero-buttons">
        {isAdmin && (
          <button
            className="primary-btn"
            onClick={() => navigate("/create-survey")}
          >
            Create New Survey
          </button>
        )}
        {isAdmin && (
          <button className="secondary-btn">
            Import Config File
          </button>
        )}
      </div>
    </div>
  );
}

export default HeroSection;