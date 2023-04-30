import React from 'react';

export const Error = ({ message }) => {
  return (
    <div className="notification is-danger">
      <button className="delete" />
      {message}
    </div>
  );
};