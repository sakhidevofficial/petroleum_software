import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ENDPOINTS } from "../../backend/API";
import { toast } from "react-toastify";


//GET ALL WASTAGES AXIOS CALL USING ASYNC THUNK
export const getWastages = createAsyncThunk("getWastages", async (initData) => {
  try {
    const { field, operator, sort, page, searchInput, startDate, endDate } = initData;

    //Creating API call using ENDPOINTS as Base URL (/api/products)
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
        `${ENDPOINTS.WASTAGE}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//GET SINGLE WASTAGE AXIOS CALL USING ASYNC THUNK
export const getSingleWastage = createAsyncThunk(
  "getSingleWastage",
  async (id) => {
    try {
      //Creating API Call using base url (/api/wastages/:id)
      return await axios
        .get(`${ENDPOINTS.WASTAGE}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
); 

//ADD WASTAGE AXIOS CALL USING ASYNC THUNK
export const addWastage = createAsyncThunk("addWastage", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/wastages)
    return await axios.post(ENDPOINTS.WASTAGE, Data).then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
  }
});
//UPDATE WASTAGE AXIOS CALL USING ASYNC THUNK
export const updateWastage = createAsyncThunk(
  "updateWastage",
  async (initData) => {
    try {
      //De Structuring data
      const { id, Data } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/wastages/:id)
      return await axios
        .put(`${ENDPOINTS.WASTAGE}/${id}`, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);
//DELETE WASTAGE AXIOS CALL USING ASYNC THUNK
export const deleteWastage = createAsyncThunk("deleteWastage", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/wastages/:id)
    return await axios
      .delete(`${ENDPOINTS.WASTAGE}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

//Creating the wastage slice
export const wastageSlice = createSlice({
  name: "wastages",
  initialState: {
    data: [],
    current: {},
    errors: [],
    totalRecord: 0,
  },
  reducers: {
    clearWastages() {
      return {
        data: [],
        current: {},
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
    //@used For     GET WASTAGES
    //@Data         Data stored in state
    builder.addCase(getWastages.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        console.log("Checking Payload => ", actions.payload);
        //First Removing all the previous page products
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const product = { ...item, id: item.id };
          //Here we are setting the fetched products in redux store
          return state.data.push(product);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE WASTAGE
    //@Response     Date Stored in State current
    builder.addCase(getSingleWastage.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        //Set state
        return {
          ...state,
          current: action.payload.data,
        };
      }
    });

    //@CaseNo       02
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Wastage
    //@Response     Success Alert
    builder.addCase(addWastage.fulfilled, (state, action) => {
      // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const wastage = {
          ...action.payload.wastage,
          id: action.payload.wastage.id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [wastage, ...poppedState];
        } else {
          state.data = [wastage, ...state.data];
        } 
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Wastage
    //@Response     Success Alert
    builder.addCase(updateWastage.fulfilled, (state, action)=> {
     if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for Success
      if (action.payload.success === true) {
        const updatedWastage = {
          ...action.payload.updated,
          id: action.payload.updated.id,
        };
        //Show Alert
        toast(action.payload.msg, { position: "top-right", type: "success" });
        return {
          ...state,
          data: state.data.map((item) =>
            item.id === action.payload.updated.id ? updatedWastage : item
          ),
          errors: [],
        };
      }
    })

    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE WASTAGE
    //@Data         Filtered data stored
    builder.addCase(deleteWastage.fulfilled, (state, action) => {
       if(action.payload?.errors?.length > 0){
        return {
          ...state,
          errors: action.payload.errors
        }
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
export const { clearWastages } = wastageSlice.actions;
export default wastageSlice.reducer;
