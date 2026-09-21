import { useNavigate } from "react-router-dom";

function SurveyTable({ surveys }) {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <h2>Recent Surveys</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Modified</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {surveys.map((survey) => (
            <tr key={survey.id}>
              <td>{survey.name}</td>
              <td>{survey.lastModified}</td>
              <td>{survey.questions}</td>

              <td>
                <button
                  onClick={() =>
                    navigate(`/builder/${survey.id}`)
                  }
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SurveyTable;