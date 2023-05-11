import React from "react";
import "./bulmaModal.css";

const BulmaModal = ({
  // The title of the modal
  title,
  // The text of the button that triggers the modal
  trigger,
  // The content of the modal
  children,
  // The function to call when the modal is closed
  onCancel,
  // The color of the button that triggers the modal, defaults to "is-link"
  buttonColor = "is-link",
  // The type of modal for styling (mainly for View and Edit modals)
  type,
  // The footer buttons to render, defaults to an empty array
  footerButtons = [],
  // Whether or not the modal is active, defaults to false
  isActive,
  // The function to call when the modal is triggered
  onTrigger,
}) => {

  // Close the modal, calling the onCancel function if it exists
  const closeModal = () => {
    if (onCancel) {
      onCancel();
    } else {
      onTrigger(false);
    }
  };

  return (
    <>
      <button
        className={`button ${buttonColor}`}
        onClick={() => onTrigger(true)}
      >
        {trigger}
      </button>
      {isActive && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal} />
          {/* Logic to set the custom size for large modals */}
          <div className={`modal-card ${(type === "view" || type === 'edit') ? "lg-card" : ""}`}>
            <header className="modal-card-head">
              <p className="modal-card-title">{title}</p>
              <button className="delete" onClick={closeModal} />
            </header>
            <section className="modal-card-body">
              <div>{children}</div>
            </section>
            <footer className="modal-card-foot">
              {footerButtons.map((button, index) => (
                <button
                  key={index}
                  className={`button ${button.color}`}
                  onClick={button.onClick}
                >
                  {button.label}
                </button>
              ))}
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default BulmaModal;
