import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StepEditForm } from "./StepEditForm";
import { updateJHA, createHazard, updateHazard, deleteHazard, createStep, updateStep } from "../../store/thunks";
import TitleAndAuthor from "./TitleAndAuthor";
import StepAccordion from "./StepAccordion";
import { AddStep } from "./AddStep";
import { selectJHAById } from "../../store/jhaSlice";

// This component displays a form for editing a single Job Hazard Analysis (JHA) record
export const EditForm = ({ jha, jhaId, closeModal }) => {
  const dispatch = useDispatch();

  // Retrieve the JHA data from the store using the `selectJHAById` selector
  const jhaData = useSelector((state) => selectJHAById(state, jha.id));

  // Destructure the JHA data to obtain the title, author, and steps
  const { title, author, steps } = jhaData;

  // Set up state for controlling which accordion is open
  const [activeAccordion, setActiveAccordion] = useState('');

  // Event handler for accordion change
  const handleAccordionChange = (val) => {
    if (val === 'title-and-author') {
      setActiveAccordion('title-and-author');
    } else {
      setActiveAccordion(activeAccordion === val ? '' : val);
    }
  };

  // // This function is used to update a step at a given index in the JHA
  // const handleUpdateStep = (stepIndex, updatedStep) => {
  //   // If the updated step is invalid, log an error and return
  //   if (!updatedStep) {
  //     console.error("Cannot update step, invalid step data");
  //     return;
  //   }

  //   // Dispatch the updateStep thunk to update the JHA in the store
  //   dispatch(updateStep({ jhaId: jha.id, stepId: updatedStep.id, ...updatedStep }));
  // };

  // // This function is used to update a hazard at a given index in a step
  // const handleUpdateHazard = (stepIndex, hazardIndex, updatedHazard) => {
  //   // Get the step that contains the hazard to update
  //   const updatedStep = steps[stepIndex];

  //   // Create a new array of hazards with the updated hazard replacing the old one
  //   const updatedHazards = updatedStep.hazards.map((hazard, index) =>
  //     index === hazardIndex ? { ...hazard, ...updatedHazard } : hazard
  //   );

  //   // Dispatch the updateStep thunk to update the JHA in the store
  //   dispatch(updateStep({ jhaId: jha.id, stepId: updatedStep.id, hazards: updatedHazards }));
  // };

  // Event handler for adding a new step to the JHA
  const handleAddStep = (description) => {
    dispatch(createStep({ jhaId: jha.id, description }))
      .then((action) => {
        const stepIndex = steps.length;
        handleAccordionChange(`step-${stepIndex}`);
      });
  };

  // Render the form elements
  return (
    <>
      <div className="form">
        {/* Render the title and author fields */}
        <TitleAndAuthor
          title={title}
          author={author}
          jhaId={jhaId}
          activeAccordion={activeAccordion}
          onAccordionChange={handleAccordionChange}
        />
        {/* Render the step accordions, passing in functions to update steps, hazards, and active accordion logic */}
        {steps.map((step, index) => (
          <StepAccordion
            key={step.id}
            index={index}
            step={step}
            // updateStep={handleUpdateStep}
            // updateHazard={handleUpdateHazard}
            activeAccordion={activeAccordion}
            onAccordionChange={handleAccordionChange}
          />
        ))}
        {/* Render the "Add Step" button */}
        <AddStep onAddStep={handleAddStep} />
      </div>
    </>
  );
};
