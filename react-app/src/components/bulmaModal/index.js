import React from "react";
import "./bulmaModal.css";

const BulmaModal = ({
  id,
  title,
  trigger,
  children,
  onSave,
  onCancel,
  buttonColor = "is-link",
  type,
  footerButtons = [],
  isActive,
  onTrigger,
}) => {
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
