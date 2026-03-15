import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

// =============================================
// ASYNC THUNK ACTIONS
// =============================================

/**
 * Fetches customers with optional filtering, sorting and pagination
 * @param {Object} initData - Contains query parameters
 * @param {string} [initData.field] - Field to filter by
 * @param {string} [initData.operator] - Comparison operator
 * @param {number} initData.sort - Sort direction (-1/1)
 * @param {number} initData.page - Page number
 * @param {string} [initData.searchInput] - Search term
 */
export const getCustomers = createAsyncThunk(
  "getCustomers",
  async (initData) => {
    try {
      const { field, operator, sort, page, searchInput } = initData;
      
      // Debug logging
      console.log("Field => ", field, "Operator =>", operator, 
                 "sort => ", sort, "Page =>", page, 
                 "Search Input =>", searchInput);

      const response = await axios.get(
        `${ENDPOINTS.CUSTOMER}?field=${field}&operator=${operator}&searchInput=${searchInput}&page=${page}&sort=${sort}`
      );
      return response.data;
    } catch (error) {
      return error.response.data.error[0];
    }
  }
);

/**
 * Fetches a single customer by ID
 * @param {string} id - Customer ID to fetch
 */
export const getSingleCustomer = createAsyncThunk(
  "getSingleCustomer",
  async (id) => {
    try {
      const response = await axios.get(`${ENDPOINTS.CUSTOMER}/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data.error[0];
    }
  }
);

/**
 * Creates a new customer
 * @param {Object} Data - Customer data to create
 */
export const addCustomer = createAsyncThunk("addCustomer", async (Data) => {
  try {
    const response = await axios.post(ENDPOINTS.CUSTOMER, Data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

/**
 * Updates an existing customer
 * @param {Object} initData - Contains ID and update data
 * @param {string} initData.id - Customer ID to update
 * @param {Object} initData.Data - Updated customer data
 */
export const updateCustomer = createAsyncThunk(
  "updateCustomer",
  async (initData) => {
    try {
      const { id, Data } = initData;
      const response = await axios.put(`${ENDPOINTS.CUSTOMER}/${id}`, Data);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

/**
 * Deletes a customer by ID
 * @param {string} id - Customer ID to delete
 */
export const deleteCustomer = createAsyncThunk("deleteCustomer", async (id) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.CUSTOMER}/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data.error[0];
  }
});

// =============================================
// REDUX SLICE DEFINITION
// =============================================

const initialState = {
  current: {},     // Currently selected customer
  data: [],        // Array of customers
  totalRecord: 0,  // Total count of records
  errors: [],      // Error messages
};

export const customerSlice = createSlice({
  name: "customers",
  initialState,
  
  // Synchronous reducers
  reducers: {
    /**
     * Resets customer state to initial values
     */
    clearCustomers: () => initialState
  },
  
  // Async action handlers
  extraReducers: (builder) => {
    
    // =============================================
    // GET CUSTOMERS HANDLER
    // =============================================
    builder.addCase(getCustomers.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        // Clear existing data
        state.data = [];
        
        // Transform and add new data
        action.payload.data.forEach((item) => {
          const customer = { ...item, id: item.id };
          state.data.push(customer);
        });
        
        // Update record count
        state.totalRecord = action.payload.totalRecords;
      }
    });

    // =============================================
    // GET SINGLE CUSTOMER HANDLER
    // =============================================
    builder.addCase(getSingleCustomer.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        state.current = action.payload.data;
      }
    });

    // =============================================
    // ADD CUSTOMER HANDLER
    // =============================================
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const customer = {
          ...action.payload.customer,
          id: action.payload.customer.id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [customer, ...poppedState];
        } else {
          state.data = [customer, ...state.data];
        } 
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    // =============================================
    // UPDATE CUSTOMER HANDLER
    // =============================================
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const updatedCustomer = {
          ...action.payload.updated,
          id: action.payload.updated.id,
        };

        // Update customer in array
        state.data = state.data.map(item =>
          item.id === updatedCustomer.id ? updatedCustomer : item
        );
        
        state.errors = [];
      }
    });

    // =============================================
    // DELETE CUSTOMER HANDLER
    // =============================================
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "error" });
        
        // Remove deleted customer from array
        state.data = state.data.filter(item => item.id !== parseInt(action.payload.id));
        state.totalRecord = action.payload.totalRecords;
      }
    });
  },
});

// Export actions and reducer
export const { clearCustomers } = customerSlice.actions;
export default customerSlice.reducer;