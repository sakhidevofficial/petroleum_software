import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

//GET ALL USERS AXIOS CALL USING ASYNC THUNK
export const getAllUsers = createAsyncThunk(
  "getAllUsers",
  async (initData) => {
    try {
      const { field, operator, sort, page, searchInput } = initData;
      
      // Debug logging
      console.log("Field => ", field, "Operator =>", operator, 
                 "sort => ", sort, "Page =>", page, 
                 "Search Input =>", searchInput);

      const response = await axios.get(
        `${ENDPOINTS.USER}?field=${field}&operator=${operator}&searchInput=${searchInput}&page=${page}&sort=${sort}`
      );
      return response.data;
    } catch (error) {
      return error.response.data.error[0];
    }
  }
);

//GET SINGLE EMPLOYEE AXIOS CALL USING ASYNC THUNK
export const getSingleUser = createAsyncThunk("getSingleUser", async (id) => {
  try {
    //Creating API Call using base url (/api/users/:id)
    return await axios.get(`${ENDPOINTS.USER}/${id}`).then((res) => res.data);
  } catch (error) {
    //In case of error
    return error.response.data.error[0];
  }
});
//ADD USER AXIOS CALL USING ASYNC THUNK
export const addUser = createAsyncThunk("addUser", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/users)
    return await axios.post(ENDPOINTS.USER, Data).then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
  }
});

//UPDATE SUPPLIER AXIOS CALL USING ASYNC THUNK
export const updateUser = createAsyncThunk("updateUser", async (initData) => {
  try {
    //De Structuring data
    const { id, Data } = initData;
    //Creating API call using ENDPOINTS as Base URL (/api/suppliers/:id)
    return await axios
      .put(`${ENDPOINTS.USER}/${id}`, Data)
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
  }
});
//Creating Users Slice
export const userSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    totalRecord: 0,
    current: {},
    errors: [],
  },
  reducers: {
    clearUsers() {
      return {
        data: [],
        totalRecord: 0,
        current: {},
        errors: [],
      };
    },

    clearCurrentUser(state) {
      state.current = {};
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET TENANTS
    //@Response         Data stored in state
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      console.log("Check for users => ", action.payload);
      //Checking for success
      if (action.payload.success === true) {
        //First Remove all previous items
        state.data = [];
        //Iterating data by map
        action.payload.data.map((item) => {
          // creating new item with id
          const user = { ...item, id: item.id };
          //Push the item in the state
          return state.data.push(user);
        });
        //Set Total records
        state.totalRecord = action.payload.totalRecords;
      }
    });

    //@CaseNo       04
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Customer
    //@Response     Success Alert
    builder.addCase(addUser.fulfilled, (state, action) => {
       // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const user = {
          ...action.payload.user,
          id: action.payload.user.id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [user, ...poppedState];
        } else {
          state.data = [user, ...state.data];
        } 
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Supplier
    //@Response     Success Alert
    builder.addCase(updateUser.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for Success
      if (action.payload.success === true) {
        const updatedUser = {
          ...action.payload.updated,
          id: action.payload.updated.id,
        };
        //Show Alert
        toast(action.payload.msg, { position: "top-right", type: "success" });
        return {
          ...state,
          data: state.data.map((item) =>
            item.id === action.payload.updated.id ? updatedUser : item
          ),
          errors: [],
        };
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE EMPLOYEE
    //@Response     Date Stored in State current
    builder.addCase(getSingleUser.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        //Set state
        return {
          ...state,
          current: action.payload.data,
        };
      }
    });
  },
});

//Export Reducer function
export const { clearUsers, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
