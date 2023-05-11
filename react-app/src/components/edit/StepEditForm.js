import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateStep, deleteStep, updateHazard, createHazard, updateControl, createControl, deleteControl, deleteHazard, fetchStep } from "../../store/thunks";

export const StepEditForm = ({ index, step }) => {
  const dispatch = useDispatch();

  // Destructure the step data to obtain the id for the JHA and the specific step
  const { jha_id, id } = step;

  // State variables for the step description, hazards, and controls
  const [description, setDescription] = useState(step.description);
  const [hazards, setHazards] = useState(step.hazards || []);
  const [controls, setControls] = useState(step.controls || []);

  // State variables for the new hazards and controls to be added.
  // These are separate from the existing hazards and controls so that they can be added in a batch when the form is submitted.
  const [newHazards, setNewHazards] = useState([]);
  const [newControls, setNewControls] = useState([]);

  // State variables for the hazards and controls to be deleted.
  // These are separate from the existing hazards and controls so that they can be deleted in a batch when the form is submitted.
  const [deletedHazards, setDeletedHazards] = useState([]);
  const [deletedControls, setDeletedControls] = useState([]);

  // State variable for tracking whether the save operation has completed
  const [saveCompleted, setSaveCompleted] = useState(false);

  // Update the component state when the `step` prop changes
  useEffect(() => {
    setDescription(step.description);
    setHazards(step.hazards || []);
    setControls(step.controls || [])
  }, [step]);

  // Reset the newHazards and newControls state when the `step` prop changes. This will prevent the new hazards and controls from being added twice on duplicate saves.
  // Also reset the deletedHazards and deletedControls state when the `step` prop changes. This will prevent the deleted hazards and controls from being deleted twice on duplicate saves.
  useEffect(() => {
    if (saveCompleted) {
      // Reset newHazards and newControls here
      setNewHazards([]);
      setNewControls([]);

      // Reset deletedHazards and deletedControls here
      setDeletedHazards([]);
      setDeletedControls([]);

      // Reset saveCompleted to false for the next save operation
      setSaveCompleted(false);
    }
  }, [saveCompleted]);  // useEffect will run when saveCompleted changes

  // Event handler for updating the step description
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
  };

  // Event handler for adding a new hazard
  const handleHazardChange = (isExisting, hazardIndex, e) => {
    const value = e.target.value;

    // If the hazard is an existing hazard, update the existing hazard
    if (isExisting) {
      const updatedHazards = [...hazards];
      updatedHazards[hazardIndex] = { ...updatedHazards[hazardIndex], description: value };
      setHazards(updatedHazards);

      // If the hazard is a new hazard, update the new hazard
    } else {
      const updatedNewHazards = [...newHazards];
      updatedNewHazards[hazardIndex] = { description: value };
      setNewHazards(updatedNewHazards);
    }
  };

  // Event handler for editing a control
  const handleControlChange = (isExisting, controlIndex, e) => {
    const value = e.target.value;

    // If the control is an existing control, update the existing control
    if (isExisting) {
      const updatedControls = [...controls];
      updatedControls[controlIndex] = { ...updatedControls[controlIndex], description: value };
      setControls(updatedControls);

      // If the control is a new control, update the new control
    } else {
      const updatedNewControls = [...newControls];
      updatedNewControls[controlIndex] = { description: value };
      setNewControls(updatedNewControls);
    }
  };

  // Event handler for deleting a new hazard
  const handleDeleteHazard = (isExisting, hazardIndex) => {

    // Check if the hazard is a new hazard
    if (!isExisting) {
      const updatedNewHazards = [...newHazards];
      // Remove the hazard from the list of new hazards
      updatedNewHazards.splice(hazardIndex, 1);
      setNewHazards(updatedNewHazards);
    } else {
      // If the hazard is an existing hazard
      const updatedHazards = [...hazards];
      const hazard = updatedHazards[hazardIndex];

      // Add the hazard to the list of hazards to be deleted
      if (hazard && hazard.id) {
        setDeletedHazards((prev) => [...prev, hazard.id]);
        dispatch(deleteHazard({ jhaId: jha_id, stepId: id, hazardId: hazard.id }));
      }

      // Remove the hazard from the list of hazards
      updatedHazards.splice(hazardIndex, 1);
      setHazards(updatedHazards);
    }
  };

  // Event handler for deleting a new control
  const handleDeleteControl = (isExisting, controlIndex) => {

    // Check if the control is a new control
    if (!isExisting) {
      const updatedNewControls = [...newControls];
      // Remove the control from the list of new controls
      updatedNewControls.splice(controlIndex, 1);
      setNewControls(updatedNewControls);
    } else {
      // If the control is an existing control
      const updatedControls = [...controls];
      const control = updatedControls[controlIndex];

      // Add the control to the list of controls to be deleted
      if (control && control.id) {
        setDeletedControls((prev) => [...prev, control.id]);
        dispatch(deleteControl({ jhaId: jha_id, stepId: id, controlId: control.id }));
      }

      // Remove the control from the list of controls
      updatedControls.splice(controlIndex, 1);
      setControls(updatedControls);
    }
  };


  // Event handler for adding a new hazard
  const handleAddHazard = () => {
    setNewHazards((prev) => [...prev, { key: Date.now(), description: "New Hazard" }]);
    // setNewControls((prev) => [...prev, { key: Date.now(), description: "New Control" }]);
  };

  // Event handler for adding a new control
  const handleAddControl = (e) => {
    console.log('handleAddControl clicked')
    console.log('newControls: ', newControls)
    // setNewHazards((prev) => [...prev, { key: Date.now(), description: "New Hazard" }]);
    setNewControls((prev) => [...prev, { key: Date.now(), description: "New Control" }]);
  };

  // Event handler for saving the step
  const handleSave = async () => {
    // Update the step description if it has changed
    if (description !== step.description) {
      dispatch(updateStep({ id, description }));
    }

    // Update the existing hazards
    const hazardUpdates = hazards.map((hazard, index) => {
      if (!hazard) return;

      const { id: hazardId } = hazard;
      const { description: hazardDescription } = hazard;

      // Check if hazard has been deleted, if so, return a promise that resolves
      if (hazardId && deletedHazards.includes(hazardId)) {
        return Promise.resolve();
      }

      // Check if the hazard has a description and an id, if not, return a promise that resolves
      if (!hazardDescription || !hazardId) return Promise.resolve();

      // Dispatch an action to update the hazard in the database
      return dispatch(updateHazard({ jhaId: jha_id, hazardId, description: hazardDescription }));
    });

    // Update the existing controls
    const controlUpdates = controls.map((control, index) => {
      if (!control) return;

      const { id: controlId } = control;
      const { description: controlDescription } = control;

      // Check if control has been deleted, if so, return a promise that resolves
      if (controlId && deletedControls.includes(controlId)) {
        return Promise.resolve();
      }

      // Check if the control has a description and an id, if not, return a promise that resolves
      if (!controlDescription || !controlId) return Promise.resolve();

      // Dispatch an action to update the control in the database
      return dispatch(updateControl({ controlId, description: controlDescription }));
    });

    // Create the new hazards. Filter out any hazards that have been deleted, then map over the remaining hazards and create them
    const newHazardCreations = newHazards.filter((hazard) => !deletedHazards.includes(hazard || hazard.key || hazard.id)).map((hazard, index) => {
      if (!hazard) return Promise.resolve();

      const { description: hazardDescription } = hazard;
      const { id: stepId } = step;

      // Check if the hazard has a description and a step id, if not, return a promise that resolves
      if (!hazardDescription || !stepId) return Promise.resolve();

      // Dispatch an action to create the hazard in the database
      return dispatch(createHazard({ jhaId: jha_id, stepId, description: hazardDescription }))
    });

    // Create the new controls. Filter out any controls that have been deleted, then map over the remaining controls and create them
    const newControlCreations = newControls.filter((control) => !deletedControls.includes(control || control.key || control.id)).map((control, index) => {
      if (!control) return Promise.resolve();

      const { description: controlDescription } = control;
      const { id: stepId } = step;

      // Check if the control has a description and a step id, if not, return a promise that resolves
      if (!controlDescription || !stepId) return Promise.resolve();

      // Dispatch an action to create the control in the database
      return dispatch(createControl({ stepId, description: controlDescription }))
    });

    // Combine all the updates and creations into a single array, then wait for all of them to finish
    const allUpdatesAndCreations = [...hazardUpdates, ...controlUpdates, ...newHazardCreations, ...newControlCreations];

    await Promise.all(allUpdatesAndCreations);

    // After saving, set the save completed state to true
    setSaveCompleted(true);

  };

  // Event handler for deleting the step
  const handleDelete = () => {
    dispatch(deleteStep({ jhaId: jha_id, stepId: id }));
  };

  // Function to create the rows for the hazards and controls
  const createRows = (isExisting, hazardList, controlList) => {
    const rowList = [];

    // Loop over the hazards and controls, creating a row for each. 
    // If there are more hazards than controls, create empty controls. If there are more controls than hazards, create empty hazards and vice versa.
    for (let i = 0; i < Math.max(hazardList.length, controlList.length); i++) {
      const hazard = hazardList[i];
      const control = controlList[i];

      // Add a new row to the list for each hazard and control
      rowList.push(
        <tr key={`row-${i}-${hazard?.id}-${control?.id}`} className="is-vcentered">
          <td>
            {/* This logic is to render a hazard with an input field, onChange event handler, as well as delete button */}
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
                    onClick={() => handleDeleteHazard(isExisting, i)}
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
            {/* This logic is to render a control with an input field, onChange event handler, as well as delete button */}
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
                    onClick={() => handleDeleteControl(isExisting, i)}
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

    // Return the list of rows
    return rowList;
  };

  // Create the rows for the existing hazards and controls
  const existingRows = createRows(true, hazards, controls);

  // Create the rows for the new hazards and controls
  const newRows = createRows(false, newHazards, newControls);

  // Combine the existing and new rows into a single array
  const rows = [...existingRows, ...newRows];


  return (
    <div>
      {/* Render the Step Description and input */}
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

      {/* Render the table of hazards and controls */}
      <table className="table is-fullwidth" style={{ tableLayout: 'fixed' }}>

        {/* Header component */}
        <thead>
          <tr>
            <th>Hazard</th>
            <th>Controls</th>
          </tr>
        </thead>

        {/* Body component, with all the rows for existing and new merged together */}
        <tbody>{rows}</tbody>

        {/* Footer component, with buttons to add a new hazard or control */}
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

      {/* Buttons to save or delete the step */}
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