import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../backend/API";

//GET ALL EXPENSES AXIOS CALL USING ASYNC THUNK
export const getExpenses = createAsyncThunk("getExpenses", async (initData) => {
  try {
    const { field, operator, sort, page, searchInput, startDate, endDate } =
      initData;

    //Creating API call using ENDPOINTS as Base URL (/api/machines)
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
        `${ENDPOINTS.EXPENSE}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//GET SINGLE EXPENSE AXIOS CALL USING ASYNC THUNK
export const getSingleExpense = createAsyncThunk(
  "getSingleExpense",
  async (id) => {
    try {
      //Creating API Call using base url (/api/expenses/:id)
      return await axios
        .get(`${ENDPOINTS.EXPENSE}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);
//ADD EXPENSE AXIOS CALL USING ASYNC THUNK
export const addExpense = createAsyncThunk("addExpense", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/expenses)
    return await axios.post(ENDPOINTS.EXPENSE, Data).then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
  }
});
//UPDATE EXPENSE AXIOS CALL USING ASYNC THUNK
export const updateExpense = createAsyncThunk(
  "updateExpense",
  async (initData) => {
    try {
      //De Structuring data
      const { id, Data } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/expenses/:id)
      return await axios
        .put(`${ENDPOINTS.EXPENSE}/${id}`, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);
//DELETE EXPENSE AXIOS CALL USING ASYNC THUNK
export const deleteExpense = createAsyncThunk("deleteExpense", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/expenses/:id)
    return await axios
      .delete(`${ENDPOINTS.EXPENSE}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

//Creating the expense slice
export const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: [],
  },
  reducers: {
    clearExpenses() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: [],
      };
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET EXPENSES
    //@Data         Data stored in state
    builder.addCase(getExpenses.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page expenses
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const expense = { ...item, id: item.id };
          //Here we are setting the fetched expenses in redux store
          return state.data.push(expense);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE EXPENSE
    //@Response     Date Stored in State current
    builder.addCase(getSingleExpense.fulfilled, (state, action) => {
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
    //@used for     Add Expense
    //@Response     Success Alert
    builder.addCase(addExpense.fulfilled, (state, action) => {
      //Check for errors
      // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });

        const expense = {
          ...action.payload.expense,
          id: action.payload.expense.id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [expense, ...poppedState];
        } else {
          state.data = [expense, ...state.data];
        }

        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Expense
    //@Response     Success Alert
    builder.addCase(updateExpense.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for Success
      if (action.payload.success === true) {
        const updatedExpense = {
          ...action.payload.updated,
          id: action.payload.updated.id,
        };
        //Show Alert
        toast(action.payload.msg, { position: "top-right", type: "success" });
        return {
          ...state,
          data: state.data.map((item) =>
            item.id === action.payload.updated.id ? updatedExpense : item
          ),
          errors: [],
        };
      }
    });
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE EXPENSE
    //@Data         Filtered data stored
    builder.addCase(deleteExpense.fulfilled, (state, action) => {
       // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
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

//export
export const { clearExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
