import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

//GET ALL EMPLOYEES ADVANCES AXIOS CALL USING ASYNC THUNK
export const getEmployeeAdvances = createAsyncThunk(
  "getEmployeeAdvances",
  async (initData) => {
    try {
      const { field, operator, sort, page, startDate, endDate, searchInput } =
        initData;

      //Creating API call using ENDPOINTS as Base URL (/api/employeeSalary)
      console.log(
        "Field => ",
        field,
        "Operator =>",
        operator,
        "sort => ",
        sort,
        "startDate => ",
        startDate,
        "EndDate => ",
        endDate,
        "Page =>",
        page,
        "Search Input =>",
        searchInput
      );
      return await axios
        .get(
          `${ENDPOINTS.EMPLOYEEADVANCE}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
        )
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data.error[0];
    }
  }
);

//GET SINGLE EMPLOYEE SALARY AXIOS CALL USING ASYNC THUNK
export const getSingleEmployeePayment = createAsyncThunk(
  "getSingleEmployeePayment",
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

//GET SINGLE EMPLOYEE SALARY AXIOS CALL USING ASYNC THUNK
export const getSingleEmployeeAdvance = createAsyncThunk(
  "getSingleEmployeeAdvance",
  async (id) => {
    try {
      //Creating API Call using base url (/api/supplierpayments/:id)
      return await axios
        .get(`${ENDPOINTS.EMPLOYEEADVANCE}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);
//ADD EMPLOYEE ADVANCE AXIOS CALL USING ASYNC THUNK
export const addEmployeeAdvance = createAsyncThunk(
  "addEmployeeAdvance",
  async (Data) => {
    try {
      //Creating API call using ENDPOINTS as Base URL (/api/employeeAdvance)
      return await axios
        .post(ENDPOINTS.EMPLOYEEADVANCE, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);

// DELETE: Remove a Employee advance
export const deleteEmployeeAdvance = createAsyncThunk(
  "deleteEmployeeAdvance",
  async (id) => {
    try {
      const response = await axios.delete(
        `${ENDPOINTS.EMPLOYEEADVANCE}/${id}`
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

//Creating Employees Advance Slice
export const employeeAdvanceSlice = createSlice({
  name: "advances",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: [],
  },
  reducers: {
    clearEmployeeAdvances() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: [],
      };
    },
       // ✅ Clear only current selected item
    clearCurrentEmployeeAdvance(state) {
      state.current = {};
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET EMPLOYEE ADVANCES
    //@Data         Data stored in state
    builder.addCase(getEmployeeAdvances.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page employee payments
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const employeeAdvances = { ...item, id: item.id };
          //Here we are setting the fetched employee advances in redux store
          return state.data.push(employeeAdvances);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       04
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Employee Salary
    //@Response     Success Alert
    builder.addCase(addEmployeeAdvance.fulfilled, (state, action) => {
      console.log(action.payload);
      //Check for errors
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for success status
      if (action.payload?.success === true) {
        //toast
        toast(action.payload.msg, { position: "top-right", type: "success" });

        //Modifying id
        const advance = {
          ...action.payload.advance,
          id: action.payload.advance.id,
        };

        //If items are 5 then remove one item from screen and add ne item
        if (state.data.length === 5) {
          let popedState = []; // Creating empty array
          //Inserting all items except last one
          state.data.forEach(
            (item, index) => index < 4 && popedState.push(item)
          );
          return {
            ...state,
            data: [advance, ...popedState],
            totalRecord: action.payload.totalRecord,
            errors: [],
          };
        } else {
          return {
            ...state,
            data: [advance, ...state.data],
            totalRecord: action.payload.totalRecord,
            errors: [],
          };
        }
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE EMPLOYEE ADVANCE
    //@Response     Date Stored in State current
    builder.addCase(getSingleEmployeeAdvance.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        //Set state
        return {
          ...state,
          current: action.payload.data,
        };
      }
    });

    // DELETE
    builder.addCase(deleteEmployeeAdvance.fulfilled, (state, action) => {
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

//Export Reducer functions
export const { clearEmployeeAdvances, clearCurrentEmployeeAdvance } = employeeAdvanceSlice.actions;
export default employeeAdvanceSlice.reducer;
