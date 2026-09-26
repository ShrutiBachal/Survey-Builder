import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <h1>Welcome to Survey Builder</h1>

      <p>Create engaging surveys with the help of AI.</p>

      <div className="hero-buttons">
        <button
          className="primary-btn"
          onClick={() => navigate("/create-survey")}
        >
          Create New Survey
        </button>

        <button className="secondary-btn">
          Import Config File
        </button>
      </div>
    </div>
  );
}

export default HeroSection;