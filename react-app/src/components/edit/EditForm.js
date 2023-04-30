import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StepEditForm } from "./StepEditForm";
import { updateJHA, createHazard, updateHazard, deleteHazard, createStep, updateStep } from "../../store/thunks";
import { useJHAForm } from "./useJHAForm";
import TitleAndAuthor from "./TitleAndAuthor";
import StepAccordion from "./StepAccordion";
import { AddStep } from "./AddStep";
import { selectJHAById } from "../../store/jhaSlice";


export const EditForm = ({ jha, jhaId, closeModal }) => {
  const dispatch = useDispatch();

  const jhaData = useSelector((state) => selectJHAById(state, jha.id));

  const { title, author, steps } = jhaData;

  const {
    dirtyFields,
    updateTitle,
    updateAuthor,
    updateStep,
    updateHazard,
  } = useJHAForm(jha);


  const [activeAccordion, setActiveAccordion] = useState('');

  const handleAccordionChange = (val) => {
    if (val === 'title-and-author') {
      setActiveAccordion('title-and-author');
    } else {
      setActiveAccordion(activeAccordion === val ? '' : val);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Check if the title or author has been modified
  //   const titleModified = dirtyFields.has("title");
  //   const authorModified = dirtyFields.has("author");

  //   // If either the title or author has been modified, dispatch the action to update the JHA
  //   if (titleModified || authorModified) {
  //     dispatch(updateJHA({ id: jha.id, title, author }));
  //   }

  //   // Loop through the modified fields and dispatch the corresponding actions
  //   for (const field of dirtyFields) {
  //     if (field.startsWith("steps.")) {
  //       // The modified field is a step or a hazard related to a step
  //       const stepIndex = parseInt(field.split(".")[1]);

  //       // Check if the modified field is a step
  //       if (field.endsWith(".description")) {
  //         const updatedStep = steps[stepIndex];
  //         dispatch(updateStep({ jhaId: jha.id, stepId: updatedStep.id, description: updatedStep.description }));
  //       } else {
  //         // The modified field is a hazard related to a step
  //         const updatedStep = steps[stepIndex];
  //         const hazardIndex = parseInt(field.split(".")[3]);

  //         const hazard = updatedStep.hazards[hazardIndex];
  //         if (hazard.dirty) {
  //           if (hazard.id) {
  //             // The hazard already exists, so dispatch the action to update the hazard
  //             dispatch(updateHazard({ jhaId: jha.id, hazardId: hazard.id, ...hazard }));
  //           } else {
  //             // The hazard is new, so dispatch the action to create the hazard
  //             dispatch(createHazard({ jhaId: jha.id, stepId: updatedStep.id, ...hazard }));
  //           }
  //         } else if (hazard.id && hazard.deleted) {
  //           // The hazard was deleted, so dispatch the action to delete the hazard
  //           dispatch(deleteHazard({ jhaId: jha.id, hazardId: hazard.id }));
  //         }
  //       }
  //     }
  //   }
  // };

  const handleAddStep = (description) => {
    dispatch(createStep({ jhaId: jha.id, description }))
      .then((action) => {
        const stepIndex = steps.length;
        handleAccordionChange(`step-${stepIndex}`);
      });
  };




  return (
    <>
      <div className="form">
        <TitleAndAuthor
          title={title}
          author={author}
          jhaId={jhaId}
          activeAccordion={activeAccordion}
          onAccordionChange={handleAccordionChange}
        />
        {steps.map((step, index) => (
          <StepAccordion
            key={step.id}
            index={index}
            step={step}
            updateStep={updateStep}
            updateHazard={updateHazard}
            activeAccordion={activeAccordion}
            onAccordionChange={handleAccordionChange}
          />

        ))}
        <AddStep onAddStep={handleAddStep} />
      </div>
    </>
  );
};
