// Redux Slice for Bank Transactions with Async Thunks
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../backend/API";

// ========== ASYNC THUNKS ==========

// GET all bank records with optional query filters
export const getBankTransactions = createAsyncThunk("getBankTransactions", async (queryParams) => {
  try {
    return await axios
      .get(`${ENDPOINTS.BANK}?${new URLSearchParams(queryParams)}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// GET single bank entry by ID
export const getSingleBank = createAsyncThunk("getSingleBank", async (id) => {
  try {
    return await axios.get(`${ENDPOINTS.BANK}/${id}`).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// POST: Add a new bank entry
export const addBank = createAsyncThunk("addBank", async (data) => {
  try {
    return await axios.post(ENDPOINTS.BANK, data).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// PUT: Update an existing bank entry
export const updateBank = createAsyncThunk("updateBank", async ({ id, Data }) => {
  try {
    console.log("Main State => ", Data);
    return await axios.put(`${ENDPOINTS.BANK}/${id}`, Data).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// DELETE: Remove a bank entry
export const deleteBank = createAsyncThunk("deleteBank", async (id) => {
  try {
    return await axios.delete(`${ENDPOINTS.BANK}/${id}`).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// ========== SLICE ==========

export const bankSlice = createSlice({
  name: "bank",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: [],
  },
  reducers: {
    // Action to clear bank state
    clearBank() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: [],
      };
    },
  },
  extraReducers: (builder) => {
    // GET all bank entries
    builder.addCase(getBankTransactions.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        state.data = action.payload.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        state.totalRecord = action.payload.totalRecords;
      }
    });

    // GET single bank entry
    builder.addCase(getSingleBank.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        state.current = action.payload.data;
      }
    });

    // ADD new bank entry
    builder.addCase(addBank.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
      } else if (action.payload.success === true) {
        toast(action.payload.msg, { type: "success" });
        const newBank = { ...action.payload.bank[0], id: action.payload.bank[0].id };
        state.data = [newBank, ...state.data.slice(0, 4)];
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    // UPDATE bank entry
    builder.addCase(updateBank.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
      } else if (action.payload.success === true) {
        toast(action.payload.msg, { type: "success" });
        const updated = { ...action.payload.updated[0], id: action.payload.updated[0].id };
        state.data = state.data.map((item) => (item.id === updated.id ? updated : item));
        state.errors = [];
      }
    });

    // DELETE bank entry
    builder.addCase(deleteBank.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        toast(action.payload.msg, { type: "error" });
        state.data = state.data.filter((item) => item.id !== parseInt(action.payload.id));
        state.totalRecord = action.payload.totalRecords;
      }
    });
  },
});

// Export reducer actions
export const { clearBank } = bankSlice.actions;
export default bankSlice.reducer;
