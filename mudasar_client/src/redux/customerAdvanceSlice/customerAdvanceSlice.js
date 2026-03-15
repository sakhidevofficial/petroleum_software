import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../backend/API"; // Adjust the path if needed

// ========== ASYNC THUNKS ==========

// GET all customer advance records with optional filters
export const getCustomerAdvances = createAsyncThunk("getCustomerAdvances", async (queryParams) => {
  try {
    const response = await axios.get(`${ENDPOINTS.CUSTOMER_ADVANCE}?${new URLSearchParams(queryParams)}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

// GET single customer advance entry by ID
export const getSingleCustomerAdvance = createAsyncThunk("getSingleCustomerAdvance", async (id) => {
  try {
    const response = await axios.get(`${ENDPOINTS.CUSTOMER_ADVANCE}/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

// POST: Add a new customer advance
export const addCustomerAdvance = createAsyncThunk("addCustomerAdvance", async (data) => {
  try {
    const response = await axios.post(ENDPOINTS.CUSTOMER_ADVANCE, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

// PUT: Update an existing customer advance
export const updateCustomerAdvance = createAsyncThunk("updateCustomerAdvance", async ({ id, Data }) => {
  try {
    const response = await axios.put(`${ENDPOINTS.CUSTOMER_ADVANCE}/${id}`, Data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

// DELETE: Remove a customer advance
export const deleteCustomerAdvance = createAsyncThunk("deleteCustomerAdvance", async (id) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.CUSTOMER_ADVANCE}/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

// ========== SLICE ==========

export const customerAdvanceSlice = createSlice({
  name: "customerAdvance",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: []
  },
  reducers: {
    clearCustomerAdvance() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: []
      };
    },
       // ✅ Clear only current selected item
    clearCurrentCustomerAdvance(state) {
      state.current = {};
    },

  },
  extraReducers: (builder) => {
    // GET all
    builder.addCase(getCustomerAdvances.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        state.data = action.payload.data.map(item => ({
          ...item,
          id: item.id,
        }));
        state.totalRecord = action.payload.totalRecords;
      }
    });

    // GET single
    builder.addCase(getSingleCustomerAdvance.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        state.current = action.payload.data;
      }
    });

    // ADD new
    builder.addCase(addCustomerAdvance.fulfilled, (state, action) => {
       // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const customerAdvance = {
          ...action.payload.advance,
          id: action.payload.advance.id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [customerAdvance, ...poppedState];
        } else {
          state.data = [customerAdvance, ...state.data];
        }
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    // UPDATE
    builder.addCase(updateCustomerAdvance.fulfilled, (state, action) => {

      console.log("Check updated advance payload => ", action.payload)
      if(action.payload?.errors?.length > 0){
        return {
          ...state,
          errors: action.payload.errors
        }
      }
      //Check for Success
      if(action.payload.success === true){
       
        
        const updatedCustomerAdvance = {...action.payload.updated, id: action.payload.updated.id}
        //Show Alert
        toast(action.payload.msg, {position: "top-right", type: "success"})
        return {
          ...state,
          data: state.data.map(item => 
            item.id === action.payload.updated.id ? updatedCustomerAdvance : item
          ),
          errors: []
        }
      }
    });

    // DELETE
    builder.addCase(deleteCustomerAdvance.fulfilled, (state, action) => {
       // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }
      if (action.payload.success === true) {
        toast(action.payload.msg, { type: "error" });
        state.data = state.data.filter((item) => item.id !== parseInt(action.payload.id));
        state.totalRecord = action.payload.totalRecords;
      }
    });
  },
});

// Export reducer and actions
export const { clearCustomerAdvance, clearCurrentCustomerAdvance } = customerAdvanceSlice.actions;
export default customerAdvanceSlice.reducer;
