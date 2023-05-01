import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchJHAs = createAsyncThunk("jhas/fetchJHAs", async () => {
    const response = await axios.get("/api/jha");
    return response.data.jhas;
});

export const createJHA = createAsyncThunk("jhas/createJHA", async (data) => {
    const response = await axios.post("/api/jha", data);
    return response.data.jha;
});

export const updateJHA = createAsyncThunk("jhas/updateJHA", async (data) => {
    const response = await axios.put(`/api/jha/updateJHA/${data.id}`, data);
    return response.data.jha;
});

export const deleteJHA = createAsyncThunk("jhas/deleteJHA", async (id) => {
    await axios.delete(`/api/jha/deleteJHA/${id}`);
    return id;
});

export const fetchStep = createAsyncThunk("jhas/fetchStep", async (id) => {
    const response = await axios.get(`/api/step/getStep/${id}`);
    return response.data.step;
});

export const createStep = createAsyncThunk(
    "jhas/createStep",
    async ({ jhaId, description }) => {
        const response = await axios.post(`/api/jha/createStep/${jhaId}/step`, {
            description,
        });
        console.log('thunk response.data: ', response.data)
        return response.data;
    }
);


export const updateStep = createAsyncThunk(
    "jhas/updateStep",
    async ({ id, description }) => {
        console.log('thunk id: ', id)
        const response = await axios.put(`/api/step/updateStep/${id}`, {
            description,
        });
        return response.data;
    }
);


export const deleteStep = createAsyncThunk(
    "jhas/deleteStep",
    async ({ stepId, jhaId }) => {
        await axios.delete(`/api/step/deleteStep/${stepId}`);
        const jha = { id: jhaId };
        return {stepId, jhaId, jha};
    }
);

export const createHazard = createAsyncThunk(
    "jhas/createHazard",
    async ({ jhaId, stepId, description, control, consequence }) => {
      console.log("create haz thunk jhaId: ", jhaId);
      console.log("create haz thunk stepId: ", stepId);
      const response = await axios.post(`/api/step/${stepId}/hazard`, {
        description,
        control,
        consequence,
      });
      const hazard = response.data.hazard;
      return { ...hazard, jhaId, stepId, jhaId: hazard.jha_id  }; // Add jhaId to the payload
    }
  );
  

export const updateHazard = createAsyncThunk(
    "jhas/updateHazard",
    async ({ jhaId, hazardId, description, control }) => {
        const response = await axios.put(`/api/hazard/${hazardId}`, {
            description,
            control,
        });
        return response.data.hazard;
    }
);

export const deleteHazard = createAsyncThunk(
    "jhas/deleteHazard",
    async ({ jhaId, hazardId }) => {
        await axios.delete(`/api/hazard/${hazardId}`);
        return hazardId;
    }
);

export const createControl = createAsyncThunk(
    "jhas/createControl",
    async ({ stepId, description }) => {
      const response = await axios.post(`/api/step/${stepId}/control`, {
        description,
      });
      const control = response.data.control;
      return { ...control, stepId, jhaId: control.jha_id }; // Include jhaId in the returned object
    }
  );
  

export const updateControl = createAsyncThunk(
    "jhas/updateControl",
    async ({ controlId, description }) => {
        const response = await axios.put(`/api/control/${controlId}`, {
            description,
        });
        return response.data.control;
    }
);

export const deleteControl = createAsyncThunk(
    "jhas/deleteControl",
    async ({ controlId }) => {
        await axios.delete(`/api/control/${controlId}`);
        return controlId;
    }
);


