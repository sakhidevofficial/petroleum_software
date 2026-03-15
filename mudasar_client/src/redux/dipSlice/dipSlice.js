import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ENDPOINTS } from "../../backend/API";
import { toast } from "react-toastify";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";


//GET ALL DIPS AXIOS CALL USING ASYNC THUNK
export const getDips = createAsyncThunk("getDips", async (initData) => {
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
        `${ENDPOINTS.DIP}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//GET SINGLE DIPS AXIOS CALL USING ASYNC THUNK
export const getSingleDip = createAsyncThunk(
  "getSingleDip",
  async (id) => {
    try {
      //Creating API Call using base url (/api/dips/:id)
      return await axios
        .get(`${ENDPOINTS.DIP}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
); 

//ADD DIP AXIOS CALL USING ASYNC THUNK
export const addDip = createAsyncThunk("addDip", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/dips)
    return await axios.post(ENDPOINTS.DIP, Data).then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
  }
});
//UPDATE DIP AXIOS CALL USING ASYNC THUNK
export const updateDip = createAsyncThunk(
  "updateDip",
  async (initData) => {
    try {
      //De Structuring data
      const { id, Data } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/dips/:id)
      return await axios
        .put(`${ENDPOINTS.DIP}/${id}`, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);
//DELETE DIPS AXIOS CALL USING ASYNC THUNK
export const deleteDip = createAsyncThunk("deleteDip", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/dips/:id)
    return await axios
      .delete(`${ENDPOINTS.DIP}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

//Creating the Dip slice
export const dipSlice = createSlice({
  name: "dips",
  initialState: {
    data: [],
    current: {},
    errors: [],
    totalRecord: 0,
  },
  reducers: {
    clearDips() {
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
    //@used For     GET DIPS
    //@Data         Data stored in state
    builder.addCase(getDips.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        console.log("Checking Payload => ", actions.payload);
        //First Removing all the previous page dips
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const dip = { ...item, id: item.id };
          //Here we are setting the fetched dips in redux store
          return state.data.push(dip);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE DIP
    //@Response     Date Stored in State current
    builder.addCase(getSingleDip.fulfilled, (state, action) => {
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
    //@used for     Add Dip
    //@Response     Success Alert
    builder.addCase(addDip.fulfilled, (state, action) => {
     // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const dip = {
          ...action.payload.dip,
          id: action.payload.dip.id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [dip, ...poppedState];
        } else {
          state.data = [dip, ...state.data];
        } 
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Dip
    //@Response     Success Alert
    builder.addCase(updateDip.fulfilled, (state, action)=> {
      
      if(action.payload?.errors?.length > 0){
        return {
          ...state,
          errors: action.payload.errors
        }
      }
      //Check for Success
      if(action.payload.success === true){
       
        const updatedWastage = {...action.payload.updated[0], id: action.payload.updated[0].id}

        console.log("Checking output in dip slice => ", updatedWastage)
        //Show Alert
        toast(action.payload.msg, {position: "top-right", type: "success"})
        return {
          ...state,
          data: state.data.map(item => 
            item.id === action.payload.updated[0].id ? updatedWastage : item
          ),
          errors: []
        }
      }
    })

    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE DIP
    //@Data         Filtered data stored
    builder.addCase(deleteDip.fulfilled, (state, action) => {
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
          totalRecord: action.payload.totalRecords,
        };
      }
    });
  },
});

//export
export const { clearDips } = dipSlice.actions;
export default dipSlice.reducer;
