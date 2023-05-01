import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateStep, deleteStep, updateHazard, createHazard, updateControl, createControl, deleteControl, deleteHazard, fetchStep } from "../../store/thunks";

export const StepEditForm = ({ index, step }) => {
  const dispatch = useDispatch();

  const { jha_id, id } = step;

  const [description, setDescription] = useState(step.description);
  const [hazards, setHazards] = useState(step.hazards || []);
  const [controls, setControls] = useState(step.controls || []);

  const [newHazards, setNewHazards] = useState([]);
  const [newControls, setNewControls] = useState([]);

  const [deletedHazards, setDeletedHazards] = useState([]);
  const [deletedControls, setDeletedControls] = useState([]);


  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
  };

  const handleHazardChange = (isExisting, hazardIndex, e) => {
    const value = e.target.value;

    if (isExisting) {
      const updatedHazards = [...hazards];
      updatedHazards[hazardIndex] = { ...updatedHazards[hazardIndex], description: value };
      setHazards(updatedHazards);
    } else {
      const updatedNewHazards = [...newHazards];
      updatedNewHazards[hazardIndex] = { description: value };
      setNewHazards(updatedNewHazards);
    }
  };

  const handleControlChange = (isExisting, controlIndex, e) => {
    const value = e.target.value;

    if (isExisting) {
      const updatedControls = [...controls];
      updatedControls[controlIndex] = { ...updatedControls[controlIndex], description: value };
      setControls(updatedControls);
    } else {
      const updatedNewControls = [...newControls];
      updatedNewControls[controlIndex] = { description: value };
      setNewControls(updatedNewControls);
    }
  };


  const handleDeleteHazard = (hazardIndex) => {
    if (hazardIndex < hazards.length) {
      const updatedHazards = [...hazards];
      const hazard = updatedHazards[hazardIndex];
      if (hazard.id) {
        setDeletedHazards((prev) => [...prev, hazard.id]);
        dispatch(deleteHazard({ jhaId: jha_id, stepId: id, hazardId: hazard.id }));
      }
      updatedHazards.splice(hazardIndex, 1);
      setHazards(updatedHazards);
    } else {
      const updatedNewHazards = [...newHazards];
      updatedNewHazards.splice(hazardIndex - hazards.length, 1);
      setNewHazards(updatedNewHazards);
    }
  };

  const handleDeleteControl = (controlIndex) => {
    if (controlIndex < controls.length) {
      const updatedControls = [...controls];
      const control = updatedControls[controlIndex];
      if (control.id) {
        setDeletedControls((prev) => [...prev, control.id]);
        dispatch(deleteControl({ jhaId: jha_id, stepId: id, controlId: control.id }));
      }
      updatedControls.splice(controlIndex, 1);
      setControls(updatedControls);
    } else {
      const updatedNewControls = [...newControls];
      updatedNewControls.splice(controlIndex - controls.length, 1);
      setNewControls(updatedNewControls);
    }
  };

  const handleAddHazard = () => {
    console.log('handleAddHazard clicked')
    console.log('newHazards: ', newHazards)
    setNewHazards((prev) => [...prev, { key: Date.now(), description: "New Hazard" }]);
    // setNewControls((prev) => [...prev, { key: Date.now(), description: "New Control" }]);
  };

  const handleAddControl = (e) => {
    console.log('handleAddControl clicked')
    console.log('newControls: ', newControls)
    // setNewHazards((prev) => [...prev, { key: Date.now(), description: "New Hazard" }]);
    setNewControls((prev) => [...prev, { key: Date.now(), description: "New Control" }]);
  };

  const handleSave = async () => {
    if (description !== step.description) {
      dispatch(updateStep({ id, description }));
    }
  
    const hazardUpdates = hazards.map((hazard, index) => {
      if (!hazard) return;
  
      const { id: hazardId } = hazard;
      const { description: hazardDescription } = hazard;
  
      // Check if hazard has been deleted
      if (hazardId && deletedHazards.includes(hazardId)) {
        return Promise.resolve();
      }
  
      if (!hazardDescription || !hazardId) return Promise.resolve();
  
      return dispatch(updateHazard({ jhaId: jha_id, hazardId, description: hazardDescription }));
    });
  
    const controlUpdates = controls.map((control, index) => {
      if (!control) return;
  
      const { id: controlId } = control;
      const { description: controlDescription } = control;
  
      // Check if control has been deleted
      if (controlId && deletedControls.includes(controlId)) {
        return Promise.resolve();
      }
  
      if (!controlDescription || !controlId) return Promise.resolve();
  
      return dispatch(updateControl({ controlId, description: controlDescription }));
    });
  
    const newHazardCreations = newHazards.filter((hazard) => !deletedHazards.includes(hazard || hazard.key || hazard.id)).map((hazard, index) => {
      if (!hazard) return Promise.resolve();
  
      const { description: hazardDescription } = hazard;
      const { id: stepId } = step;
  
      if (!hazardDescription || !stepId) return Promise.resolve();
  
      return dispatch(createHazard({ jhaId: jha_id, stepId, description: hazardDescription }))
        .then((res) => {
          // console.log('res: ', res)
        });
    });
  
    const newControlCreations = newControls.filter((control) => !deletedControls.includes(control || control.key || control.id)).map((control, index) => {
      if (!control) return Promise.resolve();
  
      const { description: controlDescription } = control;
      const { id: stepId } = step;
  
      if (!controlDescription || !stepId) return Promise.resolve();
  
      return dispatch(createControl({ stepId, description: controlDescription }))
        .then((res) => {
          console.log('res: ', res)
        });
    });
  
    const allUpdatesAndCreations = [...hazardUpdates, ...controlUpdates, ...newHazardCreations, ...newControlCreations];
  
    await Promise.all(allUpdatesAndCreations);
  
    setDeletedHazards([]);
    setDeletedControls([]);
      
    dispatch(fetchStep(id));
  };
  

  const handleDelete = () => {
    dispatch(deleteStep({ jhaId: jha_id, stepId: id }));
  };


  const createRows = (isExisting, hazardList, controlList) => {
    const rowList = [];

    for (let i = 0; i < Math.max(hazardList.length, controlList.length); i++) {
      const hazard = hazardList[i];
      const control = controlList[i];

      rowList.push(
        <tr key={`row-${i}`} className="is-vcentered">
          <td>
            {hazard && (
              <div className="field ">
                <div className="control is-flex align-items-center">
                  <input
                    className="input"
                    type="text"
                    key={`hazard-${i}`}
                    value={hazard.description || ""}
                    onChange={(e) => handleHazardChange(isExisting, i, e)}
                  />
                  <button
                    className="button is-danger"
                    onClick={() => handleDeleteHazard(i)}
                  >
                    <span className="icon is-small">
                      <i className="delete"></i>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </td>
          <td>
            {control && (
              <div className="field">
                <div className="control is-flex">
                  <input
                    className="input"
                    type="text"
                    key={`control-${i}`}
                    value={control.description || ""}
                    onChange={(e) => handleControlChange(isExisting, i, e)}
                  />
                  <button
                    className="button is-danger"
                    onClick={() => handleDeleteControl(i)}
                  >
                    <span className="icon is-small">
                      <i className="delete"></i>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </td>
        </tr>
      );
    }

    return rowList;
  };

  const existingRows = createRows(true, hazards, controls);
  const newRows = createRows(false, newHazards, newControls);

  const rows = [...existingRows, ...newRows];


  return (
    <div>
      <div className="field">
        <label className="label">Description</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
      </div>
      <table className="table is-fullwidth" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>Hazard</th>
            <th>Controls</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <tfoot>
          <tr>
            <td>
              <button className="button is-primary is-small" onClick={handleAddHazard}>Add Hazard</button>
            </td>
            <td>
              <button className="button is-primary is-small" onClick={handleAddControl}>Add Control</button>
            </td>
          </tr>
        </tfoot>

      </table>

      <div className="buttons">
        <button className="button is-primary" onClick={handleSave}>
          Save
        </button>
        <button className="button is-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}