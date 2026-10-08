import { useNavigate } from "react-router-dom";

function SurveyTable({ surveys }) {
  const navigate = useNavigate();
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
            <tr key={survey.id}>
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