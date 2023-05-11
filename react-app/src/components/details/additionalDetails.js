export const AdditionalDetails = ({ jha }) => {
  const { trainings, ppes } = jha;

  // Rendering the table of trainings and ppes
  return (
    <div className="mb-5">
      <h4 className="title is-5">Trainings</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Training</th>
          </tr>
        </thead>
        <tbody>
          {trainings?.length ? (
            trainings.map((training) => (
              <tr key={training.id}>
                <td>{training.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No trainings identified.</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>

      <h4 className="title is-5 mt-5">PPE</h4>
      <table className="table">
        <thead>
          <tr>
            <th>PPE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ppes?.length ? (
            ppes.map((ppe) => (
              <tr key={ppe.id}>
                <td>{ppe.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No PPE identified.</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
