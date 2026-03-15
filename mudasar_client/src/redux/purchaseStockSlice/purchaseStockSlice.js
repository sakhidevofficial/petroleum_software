import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../backend/API";

//GET ALL PURCHASES AXIOS CALL USING ASYNC THUNK
export const getPurchases = createAsyncThunk(
  "getPurchases",
  async (initData) => {
    try {
      const { field, operator, sort, page, startDate, endDate, searchInput } =
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
          `${ENDPOINTS.PURCHASE}?field=${field}&operator=${operator}&searchInput=${searchInput}&page=${page}&sort=${sort}&startDate=${startDate}&endDate=${endDate}`
        )
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data.error[0];
    }
  }
);

//GET SINGLE PURCHASE STOCK AXIOS CALL USING ASYNC THUNK
export const getSinglePurchase = createAsyncThunk(
  "getSinglePurchase",
  async (id) => {
    try {
      //Creating API Call using base url (/api/purchases/:id)
      return await axios
        .get(`${ENDPOINTS.PURCHASE}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);
//ADD PURCHASE AXIOS CALL USING ASYNC THUNK
export const addPurchase = createAsyncThunk("addPurchase", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/purchases)
    return await axios.post(ENDPOINTS.PURCHASE, Data).then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
  }
});
//UPDATE PURCHASE AXIOS CALL USING ASYNC THUNK
export const updatePurchase = createAsyncThunk(
  "updatePurchase",
  async (initData) => {
    try {
      //De Structuring data
      const { id, Data } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/purchases/:id)
      return await axios
        .put(`${ENDPOINTS.PURCHASE}/${id}`, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);
//DELETE PURCHASE AXIOS CALL USING ASYNC THUNK
export const deletePurchase = createAsyncThunk("deletePurchase", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/purchases/:id)
    return await axios
      .delete(`${ENDPOINTS.PURCHASE}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

//Creating the purchase slice
export const purchaseStockSlice = createSlice({
  name: "purchases",
  initialState: {
    current: {},
    data: [],
    totalRecord: 0,
    errors: [],
  },
  reducers: {
    clearPurchases() {
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
    //@used For     GET PURCHASES
    //@Data         Data stored in state
    builder.addCase(getPurchases.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        console.log("Searched Data => ", actions.payload.data);
        //First Removing all the previous page purchases
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const purchase = { ...item, id: item.id };
          //Here we are setting the fetched purchases in redux store
          return state.data.push(purchase);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE PURCHASE
    //@Response     Date Stored in State current
    builder.addCase(getSinglePurchase.fulfilled, (state, action) => {
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
    //@used for     Add Purchase
    //@Response     Success Alert
    builder.addCase(addPurchase.fulfilled, (state, action) => {
      // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const purchase = {
          ...action.payload.purchase,
          id: action.payload.purchase.id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [purchase, ...poppedState];
        } else {
          state.data = [purchase, ...state.data];
        }
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Purchase
    //@Response     Success Alert
    builder.addCase(updatePurchase.fulfilled, (state, action) => {
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for Success
      if (action.payload.success === true) {
        const updatedPurchase = {
          ...action.payload.updated[0],
          id: action.payload.updated[0].id,
        };
        console.log(action.payload.updated);
        //Show Alert
        toast(action.payload.msg, { position: "top-right", type: "success" });
        return {
          ...state,
          data: state.data.map((item) =>
            item.id === action.payload.updated[0].id ? updatedPurchase : item
          ),
          errors: [],
        };
      }
    });
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE PURCHASE
    //@Data         Filtered data stored
    builder.addCase(deletePurchase.fulfilled, (state, action) => {
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
export const { clearPurchases } = purchaseStockSlice.actions;
export default purchaseStockSlice.reducer;
