import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function SurveyTable({ surveys, onDelete }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  if (surveys.length === 0) {
      return (
        <div className="table-container">
          <h2>Recent Surveys</h2>
          <p>No surveys found.</p>
        </div>
    );
  }
  
  return (
    <div className="table-container">
      <h2>Recent Surveys</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created at</th>
            <th>Updated at</th>
          </tr>
        </thead>

        <tbody>
          {surveys.map((survey) => (
            <tr key={survey._id}>
              <td>{survey.name}</td>
              <td>{survey.description}</td>
              <td>
                {new Date(
                  survey.createdAt
                ).toLocaleDateString()}
              </td>

              <td>
                {new Date(
                  survey.updatedAt
                ).toLocaleDateString()}
              </td>

              <td>
                {isAdmin && (
                  <button
                    onClick={() =>
                      navigate(`/survey/${survey._id}`)
                    }
                  >
                  Edit
                </button>
              )}
              </td>
              <td>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => onDelete(survey._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default SurveyTable;