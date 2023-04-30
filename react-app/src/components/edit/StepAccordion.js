import React from "react";
import { StepEditForm } from "./StepEditForm";

const StepAccordion = ({ index, step, updateStep, updateHazard, activeAccordion, onAccordionChange, onSave }) => {
    const handleStepChange = (updatedStep) => {
        updateStep(index, updatedStep);
    };

    const handleHazardChange = (hazardIndex, updatedHazard) => {
        updateHazard(index, hazardIndex, updatedHazard);
    };

    return (
        <div key={step.id}>
            {index === 0 && <hr />} {/* add a divider before the first accordion */}
            {index > 0 && <br />} {/* add a line break before all other accordions */}

            <div className={`card ${activeAccordion === `step-${index}` ? "is-active" : ""}`}>
                <header className="card-header">
                    <p className="card-header-title">Step {index + 1}</p>
                    <button type='button' className="card-header-icon" onClick={() => onAccordionChange(`step-${index}`)}>
                        <span className="icon">
                            <i className={`fas fa-chevron-down ${activeAccordion === `step-${index}` ? "is-active" : ""}`}></i>
                        </span>
                    </button>
                </header>
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
