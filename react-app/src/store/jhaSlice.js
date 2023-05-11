import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";
import {
  fetchJHAs,
  createJHA,
  updateJHA,
  deleteJHA,
  fetchStep,
  createStep,
  deleteStep,
  updateStep,
  createHazard,
  deleteHazard,
  updateHazard,
  createControl,
  updateControl,
  deleteControl,
} from "./thunks";
import { produce, current } from 'immer';

// Create an entity adapter for JHA entities. 
// This adapter will allow us to perform CRUD operations on JHA entities, given their IDs.
export const jhaAdapter = createEntityAdapter();

// Create the initial state for the JHA slice of state.
const initialState = jhaAdapter.getInitialState({
  status: "idle",
  error: null,
});

// Create a slice for JHAs.
export const jhaSlice = createSlice({
  name: "jhas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetching all JHAs
      .addCase(fetchJHAs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJHAs.fulfilled, (state, action) => {
        state.status = "succeeded";
        // replace the entire object with the new object
        jhaAdapter.setAll(state, action.payload);
      })
      .addCase(fetchJHAs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // creating a JHA
      .addCase(createJHA.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createJHA.fulfilled, (state, action) => {
        state.status = "succeeded";
        jhaAdapter.addOne(state, action.payload);
      })
      .addCase(createJHA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // updating a JHA
      .addCase(updateJHA.fulfilled, (state, action) => {
        state.status = "succeeded";
        jhaAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
      })
      .addCase(updateJHA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // deleting a JHA
      .addCase(deleteJHA.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteJHA.fulfilled, (state, action) => {
        state.status = "succeeded";
        jhaAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteJHA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // fetching a step
      .addCase(fetchStep.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // Fetching a step and updating the state using Immer to enable immutability
      .addCase(fetchStep.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { jhaId, step } = action.payload;
        const jha = state.entities[jhaId];
        if (jha) {
          // Use Immer's 'produce' function to create a draft copy of the JHA entity
          const updatedJha = produce(jha, (draftJha) => {
            // Find the index of the existing step in the JHA's steps array
            const existingStepIndex = draftJha.steps.findIndex((s) => s.id === step.id);
            if (existingStepIndex !== -1) {
              // If the step exists, replace it with the updated step
              draftJha.steps[existingStepIndex] = step;
            } else {
              // If the step doesn't exist, add it to the JHA's steps array
              draftJha.steps.push(step);
            }
          });
          // Use the adapter's updateOne function to update the JHA entity in the state
          jhaAdapter.updateOne(state, { id: jhaId, changes: updatedJha });
        }
      })
      .addCase(fetchStep.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // creating a step
      .addCase(createStep.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // creating a step
      .addCase(createStep.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log('jha payload', action.payload)
        const jha = state.entities[action.payload.jhaId];
        if (jha) {
          jha.steps = jha.steps || []; // initialize the array if it doesn't exist
          // add the new step to the array
          jha.steps.push(action.payload.step);
        }
      })
      .addCase(createStep.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // deleting a step
      .addCase(deleteStep.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteStep.fulfilled, (state, action) => {
        state.status = "succeeded";
        const jhaId = action.payload.jhaId;
        const jha = state.entities[jhaId];
        if (jha) {
          // find the index of the step in the JHA's steps array
          const stepIndex = jha.steps.findIndex((step) => step.id === action.payload.stepId);
          // if the step exists, remove it from the array
          if (stepIndex !== -1) {
            jha.steps.splice(stepIndex, 1);
          }
        }
      })
      .addCase(deleteStep.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // updating a step
      .addCase(updateStep.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateStep.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log('jha payload', action.payload)
        const { id, description } = action.payload.step;
        const jhaId = action.payload.jhaId;
        const jha = state.entities[jhaId];
        if (jha) {
          const updatedJha = produce(jha, (draftJha) => {
            const stepIndex = draftJha.steps.findIndex((step) => step.id === id);
            if (stepIndex !== -1) {
              draftJha.steps[stepIndex].description = description;
            }
          });
          jhaAdapter.updateOne(state, { id: jhaId, changes: updatedJha });
        }
      })
      .addCase(updateStep.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })


      // creating a hazard
      .addCase(createHazard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createHazard.fulfilled, (state, action) => {
        state.status = "succeeded";
        const jha = state.entities[action.payload.jhaId];
        if (jha) {
          // find the index of the step in the JHA's steps array
          const stepIndex = jha.steps.findIndex(step => step.id === action.payload.step_id);
          // if the step exists, add the hazard to the step's hazards array
          if (stepIndex !== -1) {
            jha.steps[stepIndex].hazards = jha.steps[stepIndex].hazards || []; // initialize the array if it doesn't exist
            jha.steps[stepIndex].hazards.push(action.payload);
          }
        }
      })
      .addCase(createHazard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // deleting a hazard
      .addCase(deleteHazard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // deleting a hazard, using the produce function from the immer library to update the state
      .addCase(deleteHazard.fulfilled, (state, action) => {
        const { jhaId, hazardId } = action.payload;
        const jha = state.entities[jhaId];
        // find the step that contains the hazard
        if (jha) {
          // use the produce function to update the state, using a "draft" version of the JHA
          const updatedJha = produce(jha, (draftJha) => {
            draftJha.steps.forEach((step) => {
              // remove the hazard from the step's hazards array
              step.hazards = step.hazards.filter((hazard) => hazard.id !== hazardId);
            });
          });
          // use the adapter to update the state
          jhaAdapter.updateOne(state, { id: jhaId, changes: updatedJha });
        }
      })
      .addCase(deleteHazard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // updating a hazard
      .addCase(updateHazard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // updating a hazard, using the produce function from the immer library to update the state
      .addCase(updateHazard.fulfilled, (state, action) => {
        state.status = "succeeded";
        const jha = state.entities[action.payload.jha_id];
        // find the step that contains the hazard
        if (jha) {
          // use the produce function to update the state, using a "draft" version of the JHA
          const updatedJha = produce(jha, (draftJha) => {
            // find the index of the step in the JHA's steps array
            const stepIndex = draftJha.steps.findIndex(step => step.id === action.payload.step_id);
            if (stepIndex !== -1) {
              // find the index of the hazard in the step's hazards array
              const hazardIndex = draftJha.steps[stepIndex].hazards.findIndex(hazard => hazard.id === action.payload.id);
              // if the hazard exists, update its description and control
              if (hazardIndex !== -1) {
                draftJha.steps[stepIndex].hazards[hazardIndex].description = action.payload.description;
                draftJha.steps[stepIndex].hazards[hazardIndex].control = action.payload.control;
              }
            }
          });
          // use the adapter to update the state
          jhaAdapter.updateOne(state, { id: action.payload.jha_id, changes: updatedJha });
        }
      })
      .addCase(updateHazard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // creating a control
      .addCase(createControl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createControl.fulfilled, (state, action) => {
        state.status = "succeeded";
        const jha = state.entities[action.payload.jhaId];
        // find the step that contains the hazard
        if (jha) {
          // find the index of the step in the JHA's steps array
          const stepIndex = jha.steps.findIndex(step => step.id === action.payload.step_id);
          // if the step exists, add the control to the step's controls array
          if (stepIndex !== -1) {
            jha.steps[stepIndex].controls = jha.steps[stepIndex].controls || []; // initialize the array if it doesn't exist
            jha.steps[stepIndex].controls.push(action.payload);
          }
        }
      })
      .addCase(createControl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // deleting a control
      .addCase(deleteControl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // deleting a control, using the produce function from the immer library to update the state
      .addCase(deleteControl.fulfilled, (state, action) => {
        state.status = "succeeded";
        const jha = state.entities[action.payload.jhaId];
        // find the step that contains the control
        if (jha) {
          // find the index of the step in the JHA's steps array
          const stepIndex = jha.steps.findIndex(step => step.id === action.payload.stepId);
          // if the step exists, remove the control from the step's controls array
          if (stepIndex !== -1) {
            // use the produce function to update the state, using a "draft" version of the JHA
            const updatedControls = produce(jha.steps[stepIndex].controls, (draftControls) => {
              return draftControls.filter(control => control.id !== action.payload.controlId);
            });
            // update the step's controls array
            jha.steps[stepIndex].controls = updatedControls;
          }
        }
      })
      .addCase(deleteControl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // updating a control
      .addCase(updateControl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateControl.fulfilled, (state, action) => {
        state.status = "succeeded";
        const jha = state.entities[action.payload.jha_id];
        if (jha) {
          // use the produce function to update the state, using a "draft" version of the JHA
          const updatedJha = produce(jha, (draftJha) => {
            // find the step that contains the control
            const stepIndex = draftJha.steps.findIndex(step => step.id === action.payload.step_id);
            if (stepIndex !== -1) {
              // find the control in the step's controls array
              const controlIndex = draftJha.steps[stepIndex].controls.findIndex(control => control.id === action.payload.id);
              // if the control exists, update its description
              if (controlIndex !== -1) {
                draftJha.steps[stepIndex].controls[controlIndex].description = action.payload.description;
              }
            }
          });
          // use the adapter to update the state
          jhaAdapter.updateOne(state, { id: action.payload.jha_id, changes: updatedJha });
        }
      })
      .addCase(updateControl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

  },
});

export const selectJHAs = (state) => state.jhas.jhas;

export const selectJHAById = (state, jhaId) => {
  if (state.jhas) {
    return state.jhas.entities[jhaId];
  }
  return null; // or return a default value
};


export const selectAllJHAs = (state) => {
  const jhaArray = [];
  Object.keys(state.jhas.entities).forEach((key) => {
    jhaArray.push(state.jhas.entities[key]);
  });
  return jhaArray;
};

export default jhaSlice.reducer;
