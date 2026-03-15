// Redux Slice for Cash Entries with Async Thunks
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../backend/API";

// ========== ASYNC THUNKS ==========

// GET all cash records with optional query filters
export const getCashes = createAsyncThunk("getCashes", async (queryParams) => {
  try {
    return await axios
      .get(`${ENDPOINTS.CASH}?${new URLSearchParams(queryParams)}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// GET single cash entry by ID
export const getSingleCash = createAsyncThunk("getSingleCash", async (id) => {
  try {
    return await axios.get(`${ENDPOINTS.CASH}/${id}`).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// POST: Add a new cash entry
export const addCash = createAsyncThunk("addCash", async (data) => {
  try {
    return await axios.post(ENDPOINTS.CASH, data).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// PUT: Update an existing cash entry
export const updateCash = createAsyncThunk("updateCash", async ({ id, Data }) => {
  try {
     console.log("Main State => ", Data)
    return await axios.put(`${ENDPOINTS.CASH}/${id}`, Data).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// DELETE: Remove a cash entry
export const deleteCash = createAsyncThunk("deleteCash", async (id) => {
  try {
    return await axios.delete(`${ENDPOINTS.CASH}/${id}`).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// ========== SLICE ==========

export const cashSlice = createSlice({
  name: "cash",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: []
  },
  reducers: {
    // Action to clear cash state
    clearCash() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: []
      };
    },
  },
  extraReducers: (builder) => {
    // GET all cash entries
    builder.addCase(getCashes.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        state.data = action.payload.data.map(item => ({
          ...item,
          id: item.id,
        }));
        state.totalRecord = action.payload.totalRecord;
      }
    });

    // GET single cash entry
    builder.addCase(getSingleCash.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        state.current = action.payload.data;
      }
    });

    // ADD new cash entry
    builder.addCase(addCash.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
      } else if (action.payload.success === true) {
        toast(action.payload.msg, { type: "success" });
        const newCash = { ...action.payload.cash[0], id: action.payload.cash[0].id };
        state.data = [newCash, ...state.data.slice(0, 4)];
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    // UPDATE cash entry
    builder.addCase(updateCash.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
      } else if (action.payload.success === true) {
        toast(action.payload.msg, { type: "success" });
        const updated = { ...action.payload.updated[0], id: action.payload.updated[0].id };
        state.data = state.data.map((item) => (item.id === updated.id ? updated : item));
        state.errors = [];
      }
    });

    // DELETE cash entry
    builder.addCase(deleteCash.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        toast(action.payload.msg, { type: "error" });
        state.data = state.data.filter((item) => item.id !== parseInt(action.payload.id));
        state.totalRecord = action.payload.totalRecords;
      }
    });
  },
});

// Export reducer actions
export const { clearCash } = cashSlice.actions;
export default cashSlice.reducer;