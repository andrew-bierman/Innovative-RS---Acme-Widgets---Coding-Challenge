import React from "react";
import { StepEditForm } from "./StepEditForm";

const StepAccordion = ({ index, step, activeAccordion, onAccordionChange }) => {
    return (
        <div key={step.id}>
            {/* Add a divider before the first accordion */}
            {index === 0 && <hr />} 
            {/* Add a line break before all other accordions */}
            {index > 0 && <br />} 

            {/* Use the `is-active` class to show the active accordion */}
            <div className={`card ${activeAccordion === `step-${index}` ? "is-active" : ""}`}>
                <header className="card-header">
                    <p className="card-header-title">Step {index + 1}</p>
                    {/* Call the `onAccordionChange` function when the accordion header is clicked */}
                    <button type='button' className="card-header-icon" onClick={() => onAccordionChange(`step-${index}`)}>
                        <span className="icon">
                            {/* Use the `is-active` class to show the active chevron icon */}
                            <i className={`fas fa-chevron-down ${activeAccordion === `step-${index}` ? "is-active" : ""}`}></i>
                        </span>
                    </button>
                </header>
                
                {/* Render the `StepEditForm` component when the accordion is active */}
                {activeAccordion === `step-${index}` && (
                    <div className="card-content">
                        <StepEditForm
                            index={index}
                            step={step}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default StepAccordion;
