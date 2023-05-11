import React from 'react';

export const Error = ({ message }) => {
  // Render the error message
  return (
    <div className="notification is-danger">
      <button className="delete" />
      {message}
    </div>
  );
};