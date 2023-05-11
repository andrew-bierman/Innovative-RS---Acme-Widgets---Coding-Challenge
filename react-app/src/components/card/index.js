import React, { useState } from "react";
import BulmaModal from "../bulmaModal";
import JHADetails from "../details";
import { useDispatch } from "react-redux";
import { deleteJHA } from "../../store/thunks";
import { EditForm } from "../edit/EditForm";

// This component displays a single Job Hazard Analysis (JHA) record
export const JHACard = ({ jha, onDelete }) => {
  const dispatch = useDispatch();

  // Set up state for modals
  const [viewModalIsActive, setViewModalIsActive] = useState(false);
  const [editModalIsActive, setEditModalIsActive] = useState(false);
  const [deleteModalIsActive, setDeleteModalIsActive] = useState(false);

  // Helper function to count the number of hazards in the JHA
  const countHazards = () => {
    let count = 0;

    // Handle cases where the JHA doesn't have any steps or hazards
    if (!jha.steps) return count;
    if (jha.steps.length === 0) return count;
    if (!jha.steps[0].hazards) return count;
    if (jha.steps[0].hazards.length === 0) return count;

    // Count the number of hazards in each step
    jha.steps.forEach((step) => {
      if (!step.hazards) return count;
      count += step.hazards.length;
    });
    return count;
  };

  // Helper function to count the number of controls in the JHA
  const countControls = () => {
    let count = 0;

    // Handle cases where the JHA doesn't have any steps or controls
    if (!jha.steps) return count;
    if (jha.steps.length === 0) return count;
    if (!jha.steps[0].controls) return count;
    if (jha.steps[0].controls.length === 0) return count;

    // Count the number of controls in each step
    jha.steps.forEach((step) => {
      if (!step.controls) return count;
      count += step.controls.length;
    });
    return count;
  };

  // Handle JHA deletion
  const handleDelete = () => {
    dispatch(deleteJHA(jha.id));
  };

  // Count the number of hazards and controls in the JHA
  const hazardsCount = countHazards(jha);
  const controlsCount = countControls(jha);

  return (
    <div className="card ">
      <header className="card-header">
        {/* Render the JHA title */}
        <p className="card-header-title">{jha.title}</p>

        {/* Render the Edit and Delete modal button triggers */}
        <div className="card-header-icons">
          {/* Render the Edit modal button trigger */}
          <BulmaModal
            id={`jha-modal-${jha.id}-edit`}
            isActive={editModalIsActive}
            trigger={<span className="icon is-small"><i className="fas fa-edit"></i></span>}
            onTrigger={setEditModalIsActive}
            title={jha.title}
            type="edit"
            buttonColor="is-link"
            onCancel={() => setEditModalIsActive(false)}
          >
            {/* The edit form is nested within the modal, and only appears when modal is active */}
            <EditForm jha={jha} jhaId={jha.id} closeModal={() => setEditModalIsActive(false)} />
          </BulmaModal>

          {/* Render the Delete modal button trigger */}
          <BulmaModal
            id={`jha-modal-${jha.id}-delete`}
            isActive={deleteModalIsActive}
            trigger={<span className="icon is-small"><i className="fas fa-trash"></i></span>}
            onTrigger={setDeleteModalIsActive}
            title={jha.title}
            buttonColor="is-danger"
            footerButtons={[
              {
                label: "Delete",
                color: "is-danger",
                onClick: handleDelete,
              },
              {
                label: "Cancel",
                onClick: () => setDeleteModalIsActive(false),
              },
            ]}
            onCancel={() => setDeleteModalIsActive(false)}
          >
            {/* The delete confirmation message is nested within the modal, and only appears when modal is active */}
            <p>Are you sure you want to delete this JHA?</p>
          </BulmaModal>
        </div>
      </header>

      {/* Render a preview of the JHA details */}
      <div className="card-content">
        <p className="subtitle is-6">Author: {jha.author}</p>
        <p className="subtitle is-7">Steps: {jha.steps?.length}</p>
        <p className="subtitle is-7">Hazards: {hazardsCount}</p>
        <p className="subtitle is-7">Controls: {controlsCount}</p>
      </div>

      {/* Render the View Details modal button trigger */}
      <footer className="card-footer is-justify-content-center">
        <BulmaModal
          id={`jha-modal-${jha.id}-view`}
          isActive={viewModalIsActive}
          trigger={"View Details"}
          onTrigger={setViewModalIsActive}
          title={jha.title}
          buttonColor={"is-primary"}
          type={"view"}
          onCancel={() => setViewModalIsActive(false)}
        >
          {/* The JHA details are nested within the modal, and only appear when modal is active */}
          <JHADetails jhaId={jha.id} closeModal={() => setViewModalIsActive(false)} />
        </BulmaModal>
      </footer>
    </div>
  );
};
