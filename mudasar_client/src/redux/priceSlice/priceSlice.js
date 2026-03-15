import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ENDPOINTS } from "../../backend/API";
import { toast } from "react-toastify";


//GET ALL PRICES AXIOS CALL USING ASYNC THUNK
export const getPrices = createAsyncThunk("getPrices", async (initData) => {
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
        `${ENDPOINTS.PRICE}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//GET SINGLE PRODUCT AXIOS CALL USING ASYNC THUNK
export const getSinglePrice = createAsyncThunk(
  "getSinglePrice",
  async (id) => {
    try {
      console.log("Row id in price Slice => ", id)
      //Creating API Call using base url (/api/products/:id)
      return await axios
        .get(`${ENDPOINTS.PRICE}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
); 

//ADD PRICE AXIOS CALL USING ASYNC THUNK
export const addPrice = createAsyncThunk("addPrice", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/prices)
    return await axios.post(ENDPOINTS.PRICE, Data).then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
  }
});

//DELETE PRICE AXIOS CALL USING ASYNC THUNK
export const deletePrice = createAsyncThunk("deletePrice", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/prices/:id)
    return await axios
      .delete(`${ENDPOINTS.PRICE}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

//Creating the price slice
export const priceSlice = createSlice({
  name: "prices",
  initialState: {
    data: [],
    current: {},
    errors: [],
    totalRecord: 0,
  },
  reducers: {
    clearPrices() {
      return {
        data: [],
        current: {},
        totalRecord: 0,
        errors: [],
      };
    },

    clearCurrentPrice(state){
      state.current = {}
    }
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET PRICES
    //@Data         Data stored in state
    builder.addCase(getPrices.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        console.log("Checking Payload => ", actions.payload);
        //First Removing all the previous page prices
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const price = { ...item, id: item.id };
          //Here we are setting the fetched prices in redux store
          return state.data.push(price);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE PRODUCT
    //@Response     Date Stored in State current
    builder.addCase(getSinglePrice.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        //Set state
        return {
          ...state,
          current: action.payload.price[0],
        };
      }
    });

    //@CaseNo       02
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Price
    //@Response     Success Alert
    builder.addCase(addPrice.fulfilled, (state, action) => {
     // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const price = {
          ...action.payload.price[0],
          id: action.payload.price[0].id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [price, ...poppedState];
        } else {
          state.data = [price, ...state.data];
        } 
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }

    });

   

    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE PRICE
    //@Data         Filtered data stored
    builder.addCase(deletePrice.fulfilled, (state, action) => {
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
          totalRecord: action.payload.totalRecords,
        };
      }
    });
  },
});

//export
export const { clearPrices, clearCurrentPrice } = priceSlice.actions;
export default priceSlice.reducer;
