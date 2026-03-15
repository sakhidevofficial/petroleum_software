import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../backend/API";

//GET ALL EMPLOYEES AXIOS CALL USING ASYNC THUNK
export const getEmployees = createAsyncThunk(
  "getEmployees",
  async (initData) => {
    try {
      const { field, operator, sort, page, searchInput } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/employees)
      // field=${field}&operator=${operator}&searchInput=${searchInput}&
      console.log(
        "Field => ",
        field,
        "Operator =>",
        operator,
        "sort => ",
        sort,
        "Page =>",
        page,
        "Search Input =>",
        searchInput
      );
      return await axios
        .get(
          `${ENDPOINTS.EMPLOYEE}?field=${field}&operator=${operator}&searchInput=${searchInput}&page=${page}&sort=${sort}`
        )
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data.error[0];
    }
  }
);

//GET SINGLE EMPLOYEE AXIOS CALL USING ASYNC THUNK
export const getSingleEmployee = createAsyncThunk(
  "getSingleEmployee",
  async (id) => {
    try {
      //Creating API Call using base url (/api/employees/:id)
      return await axios
        .get(`${ENDPOINTS.EMPLOYEE}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);
//ADD EMPLOYEE AXIOS CALL USING ASYNC THUNK
export const addEmployee = createAsyncThunk("addEmployee", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/employees)
    return await axios.post(ENDPOINTS.EMPLOYEE, Data).then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
  }
});
//UPDATE UPDATE AXIOS CALL USING ASYNC THUNK
export const updateEmployee = createAsyncThunk(
  "updateEmployee",
  async (initData) => {
    try {
      //De Structuring data
      const { id, Data } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/employees/:id)
      return await axios
        .put(`${ENDPOINTS.EMPLOYEE}/${id}`, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);
//DELETE EMPLOYEE AXIOS CALL USING ASYNC THUNK
export const deleteEmplyee = createAsyncThunk("deleteEmplyee", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/emplyees/:id)
    return await axios
      .delete(`${ENDPOINTS.EMPLOYEE}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

//Creating the employee slice
export const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: [],
  },
  reducers: {
    clearEmployees() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: [],
      };
    },
    // ✅ Clear only current selected item
    clearCurrentEmplyee(state) {
      state.current = {};
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET EMPLOYEES
    //@Data         Data stored in state
    builder.addCase(getEmployees.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page employees
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const employee = { ...item, id: item.id };
          //Here we are setting the fetched employees in redux store
          return state.data.push(employee);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE EMPLOYEE
    //@Response     Date Stored in State current
    builder.addCase(getSingleEmployee.fulfilled, (state, action) => {
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
    //@used for     Add Employee
    //@Response     Success Alert
    builder.addCase(addEmployee.fulfilled, (state, action) => {
   // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const employee = {
          ...action.payload.employee,
          id: action.payload.employee.id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [employee, ...poppedState];
        } else {
          state.data = [employee, ...state.data];
        } 
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    
    });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Employee
    //@Response     Success Alert
    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for Success
      if (action.payload.success === true) {
        //Show Alert
        toast(action.payload.msg, { position: "top-right", type: "success" });

        //Modifying id
        const employee = {
          ...action.payload.employee,
          id: action.payload.employee.id,
        };

        //If items are 5 then remove one item from screen and add ne item
        if (state.data.length === 5) {
          let popedState = []; // Creating empty array

          //Inserting all items except last one
          state.data.forEach(
            (item, index) => item.id !== employee.id && popedState.push(item)
          );
          return {
            ...state,
            data: [employee, ...popedState],
            errors: [],
          };
        }
      }
    });
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE EMPLOYEE
    //@Data         Filtered data stored
    builder.addCase(deleteEmplyee.fulfilled, (state, action) => {
      //Check for request success
      if (action.payload.success === true) {
        //Set Alert
        toast(action.payload.msg, { position: "top-right", type: "error" });
        return {
          ...state,
          data: [...state.data.filter((item) => item.id !== parseInt(action.payload.id))],
          totalRecord: action.payload.totalRecords,
        };
      }
    });
  },
});

//export
export const { clearEmployees, clearCurrentEmplyee } = employeeSlice.actions;
export default employeeSlice.reducer;
