import React, { useState } from "react";
import BulmaModal from "../bulmaModal";
import JHADetails from "../details";
import { useDispatch } from "react-redux";
import { deleteJHA } from "../../store/thunks";
import { EditForm } from "../edit/EditForm";

export const JHACard = ({ jha, onDelete }) => {
  const dispatch = useDispatch();

  const [viewModalIsActive, setViewModalIsActive] = useState(false);
  const [editModalIsActive, setEditModalIsActive] = useState(false);
  const [deleteModalIsActive, setDeleteModalIsActive] = useState(false);

  const countHazards = () => {
    let count = 0;

    if(!jha.steps) return count;
    if(jha.steps.length === 0) return count;
    if(!jha.steps[0].hazards) return count;
    if(jha.steps[0].hazards.length === 0) return count;

    jha.steps.forEach((step) => {
      if(!step.hazards) return count;
      count += step.hazards.length;
    });
    return count;
  };

  const countControls = () => {
    let count = 0;

    if(!jha.steps) return count;
    if(jha.steps.length === 0) return count;
    if(!jha.steps[0].controls) return count;
    if(jha.steps[0].controls.length === 0) return count;

    jha.steps.forEach((step) => {
      if(!step.controls) return count;
      count += step.controls.length;
    });
    return count;
  };

  const handleDelete = () => {
    dispatch(deleteJHA(jha.id));
  };

  const hazardsCount = countHazards(jha);
  const controlsCount = countControls(jha);


  return (
    <div className="card ">
      <header className="card-header">
        <p className="card-header-title">{jha.title}</p>
        
        <div className="card-header-icons">
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
            <EditForm jha={jha} jhaId={jha.id} closeModal={() => setEditModalIsActive(false)} />
          </BulmaModal>

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
            <p>Are you sure you want to delete this JHA?</p>
          </BulmaModal>
        </div>
      </header>
      <div className="card-content">
        <p className="subtitle is-6">Author: {jha.author}</p>
        <p className="subtitle is-7">Steps: {jha.steps?.length}</p>
        <p className="subtitle is-7">Hazards: {hazardsCount}</p>
        <p className="subtitle is-7">Controls: {controlsCount}</p>

      </div>
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
            <JHADetails jhaId={jha.id} closeModal={() => setViewModalIsActive(false)} />
          </BulmaModal>
      </footer>
    </div>
  );
};
