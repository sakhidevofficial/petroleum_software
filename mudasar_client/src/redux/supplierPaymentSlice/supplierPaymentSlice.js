import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

//GET ALL SUPPLIER PAYMENTS AXIOS CALL USING ASYNC THUNK
export const getSupplierPayments = createAsyncThunk(
  "getSupplierPayments",
  async (initData) => {
    try {
      const { field, operator, sort, page, startDate, endDate, searchInput } =
        initData || {};
      const params = new URLSearchParams();
      if (field != null && field !== "") params.set("field", field);
      if (operator != null && operator !== "") params.set("operator", operator);
      if (sort != null && sort !== "") params.set("sort", String(sort));
      if (page != null && page !== "") params.set("page", String(page));
      if (startDate != null && startDate !== "") params.set("startDate", startDate);
      if (endDate != null && endDate !== "") params.set("endDate", endDate);
      if (searchInput != null && searchInput !== "") params.set("searchInput", searchInput);
      const query = params.toString();
      const url = query ? `${ENDPOINTS.SUPPLIERPAYMENT}?${query}` : ENDPOINTS.SUPPLIERPAYMENT;
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      return error.response?.data?.error?.[0] ?? error.response?.data ?? { msg: "Failed to load supplier payments" };
    }
  }
);

//GET SINGLE SUPPLIER PAYMENT AXIOS CALL USING ASYNC THUNK
export const getSingleSupplierPayment = createAsyncThunk(
  "getSingleSupplierPayment",
  async (id) => {
    try {
      //Creating API Call using base url (/api/supplierpayments/:id)
      return await axios
        .get(`${ENDPOINTS.SUPPLIERPAYMENT}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);
//ADD SUPPLIER PAYMENT AXIOS CALL USING ASYNC THUNK
export const addSupplierPayment = createAsyncThunk(
  "addSupplierPayment",
  async (Data, { rejectWithValue }) => {
    try {
      const res = await axios.post(ENDPOINTS.SUPPLIERPAYMENT, Data);
      return res.data;
    } catch (error) {
      const data = error.response?.data;
      const msg = data?.errors?.[0]?.msg ?? data?.errors?.msg ?? data?.msg ?? "Failed to add supplier payment";
      return rejectWithValue(Array.isArray(data?.errors) ? data.errors : [{ msg }]);
    }
  }
);
//UPDATE SUPPLIER AXIOS CALL USING ASYNC THUNK
export const updateSupplierPayment = createAsyncThunk(
  "updateSupplierPayment",
  async (initData) => {
    try {
      //De Structuring data
      const { id, Data } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/supplierpayments/:id)
      return await axios
        .put(`${ENDPOINTS.SUPPLIERPAYMENT}/${id}`, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);
//DELETE SUPPLIER PAYMENT AXIOS CALL USING ASYNC THUNK
export const deleteSupplierPayment = createAsyncThunk(
  "deleteSupplierPayment",
  async (id) => {
    try {
      //Creating API Call using ENDPOINTS as Base URL (/api/supplierpayments/:id)
      return await axios
        .delete(`${ENDPOINTS.SUPPLIERPAYMENT}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      return error.response.data.error[0];
    }
  }
);

//Creating Suppliers Payment Slice
export const supplierPaymentSlice = createSlice({
  name: "supplierPayments",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: [],
  },
  reducers: {
    clearSupplierPayments() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: [],
      };
    },
    // ✅ Clear only current selected item
    clearCurrentSupplierPayment(state) {
      state.current = {};
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SUPPLIER PAYMENTS
    //@Data         Data stored in state
    builder.addCase(getSupplierPayments.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page supplier payments
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const supplierPayment = { ...item, id: item.id };
          //Here we are setting the fetched supplier payments in redux store
          return state.data.push(supplierPayment);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE SUPPLIER PAYMENT
    //@Response     Date Stored in State current
    builder.addCase(getSingleSupplierPayment.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        //Set state
        return {
          ...state,
          current: action.payload.data,
        };
      }
    });

    //@CaseNo       04
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Supplier Payment
    //@Response     Success Alert
    builder.addCase(addSupplierPayment.fulfilled, (state, action) => {
      if (action.payload?.success !== true) return;
      toast(action.payload.msg, { position: "top-right", type: "success" });
      const supplierpayment = {
        ...action.payload.supplierpayment,
        id: action.payload.supplierpayment.id,
      };
      if (state.data.length >= 5) {
        state.data = [supplierpayment, ...state.data.slice(0, 4)];
      } else {
        state.data = [supplierpayment, ...state.data];
      }
      state.totalRecord = action.payload.totalRecord ?? state.totalRecord;
      state.errors = [];
    });
    builder.addCase(addSupplierPayment.rejected, (state, action) => {
      state.errors = action.payload || [{ msg: "Failed to add supplier payment" }];
      const first = state.errors[0];
      toast(first?.msg || "Failed to add supplier payment", { position: "top-right", type: "error" });
    });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Supplier Payment
    //@Response     Success Alert
    builder.addCase(updateSupplierPayment.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for Success
      if (action.payload.success === true) {
        const updatedSupplierPayment = {
          ...action.payload.updated[0],
          id: action.payload.updated[0].id,
        };
        //Show Alert
        toast(action.payload.msg, { position: "top-right", type: "success" });
        return {
          ...state,
          data: state.data.map((item) =>
            item.id === action.payload.updated[0].id
              ? updatedSupplierPayment
              : item
          ),
          errors: [],
        };
      }
    });
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE SUPPLIER PAYMENT
    //@Data         Filtered data stored
    builder.addCase(deleteSupplierPayment.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for request success
      if (action.payload.success === true) {
        //Set Alert
        toast(action.payload.msg, { position: "top-right", type: "error" });
        return {
          ...state,
          data: [...state.data.filter((item) => item.id !== parseInt(action.payload.id))],
          totalRecord: action.payload.totalRecord,
        };
      }
    });
  },
});

//Export Reducer functions
export const { clearSupplierPayments, clearCurrentSupplierPayment } =
  supplierPaymentSlice.actions;
export default supplierPaymentSlice.reducer;
