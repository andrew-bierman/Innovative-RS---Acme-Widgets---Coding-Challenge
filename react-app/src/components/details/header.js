export const JHADetailsHeader = ({ jha }) => {
  // Rendering the header of the JHA details page
    return (
      <>
        <h2 className="title is-4">{jha.title}</h2>
        <p>
          <strong>Author:</strong> {jha.author}
        </p>
      </>
    );
  };
  