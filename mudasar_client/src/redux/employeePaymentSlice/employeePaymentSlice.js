import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

// GET ALL EMPLOYEE PAYMENTS
export const getEmployeePayments = createAsyncThunk("getEmployeePayments", async (initData) => {
  try {
    const { field, operator, sort, page, startDate, endDate, searchInput } = initData;

    return await axios
      .get(
        `${ENDPOINTS.EMPLOYEEPAYMENT}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

// GET SINGLE EMPLOYEE PAYMENT
export const getSingleEmployeePayment = createAsyncThunk("getSingleEmployeePayment", async (id) => {
  try {
    return await axios.get(`${ENDPOINTS.EMPLOYEEPAYMENT}/${id}`).then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

// ADD EMPLOYEE PAYMENT
export const addEmployeePayment = createAsyncThunk("addEmployeePayment", async (Data) => {
  try {
    return await axios.post(ENDPOINTS.EMPLOYEEPAYMENT, Data).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// UPDATE EMPLOYEE PAYMENT
export const updateEmployeePayment = createAsyncThunk("updateEmployeePayment", async (initData) => {
  try {
    const { id, Data } = initData;
    return await axios.put(`${ENDPOINTS.EMPLOYEEPAYMENT}/${id}`, Data).then((res) => res.data);
  } catch (error) {
    return error.response.data;
  }
});

// DELETE EMPLOYEE PAYMENT
export const deleteEmployeePayment = createAsyncThunk("deleteEmployeePayment", async (id) => {
  try {
    return await axios.delete(`${ENDPOINTS.EMPLOYEEPAYMENT}/${id}`).then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

// SLICE
export const employeePaymentSlice = createSlice({
  name: "employeePayments",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: [],
  },
  reducers: {
    clearEmployeePayments() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: [],
      };
    },
    clearCurrentEmployeePayment(state) {
      state.current = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEmployeePayments.fulfilled, (state, actions) => {
      if (actions.payload.success === true) {
        state.data = [];
        actions.payload.data.map((item) => {
          const employeePayment = { ...item, id: item.id };
          return state.data.push(employeePayment);
        });
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    builder.addCase(getSingleEmployeePayment.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        return {
          ...state,
          current: action.payload.data,
        };
      }
    });

    builder.addCase(addEmployeePayment.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });

        const employeePayment = {
          ...action.payload.employeepayment[0],
          id: action.payload.employeepayment[0].id,
        };

        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [employeePayment, ...poppedState];
        } else {
          state.data = [employeePayment, ...state.data];
        }

        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    builder.addCase(updateEmployeePayment.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }

      if (action.payload.success === true) {
        const updatedEmployeePayment = {
          ...action.payload.updated[0],
          id: action.payload.updated[0].id,
        };

        toast(action.payload.msg, { position: "top-right", type: "success" });

        return {
          ...state,
          data: state.data.map((item) =>
            item.id === action.payload.updated[0].id ? updatedEmployeePayment : item
          ),
          errors: [],
        };
      }
    });

    builder.addCase(deleteEmployeePayment.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }

      if (action.payload.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "error" });

        return {
          ...state,
          data: state.data.filter((item) => item.id !== parseInt(action.payload.id)),
          totalRecord: action.payload.totalRecords,
        };
      }
    });
  },
});

export const { clearEmployeePayments, clearCurrentEmployeePayment } = employeePaymentSlice.actions;
export default employeePaymentSlice.reducer;
