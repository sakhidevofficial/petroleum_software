import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { DOMAIN, ENDPOINTS } from "../../backend/API";
import { toast } from "react-toastify";


//GET ALL CLOSINGS AXIOS CALL USING ASYNC THUNK
export const getSaleClosings = createAsyncThunk(
  "getSaleClosings",
  async (initData) => {
    try {
      const { field, operator, sort, page, searchInput, startDate, endDate } =
        initData;

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
          `${ENDPOINTS.CLOSE}?field=${field}&operator=${operator}&searchInput=${searchInput}&page=${page}&sort=${sort}&startDate=${startDate}&endDate=${endDate}`
        )
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data.error[0];
    }
  }
);

//GET SINGLE SALE AXIOS CALL USING ASYNC THUNK
export const getSingleSale = createAsyncThunk(
  "getSingleProduct",
  async (id) => {
    try {
      console.log(id);
      //Creating API Call using base url (/api/sales/:id)
      return await axios.get(`${ENDPOINTS.SALE}/${id}`).then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);

//GET TODAYS CLOSING AXIOS CALL USING ASYNC THUNK
export const getTodaysClosing = createAsyncThunk(
  "getTodaysClosing",
  async () => {
    try {
      console.log();
      //Creating API Call using base url (/api/checkClosing)
      return await axios.get(`${ENDPOINTS.TODAYCLOSE}`).then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);
//GET PRINT CLOSING AXIOS CALL USING ASYNC THUNK
export const getPrintClosingReport = createAsyncThunk(
  "getPrintClosingReport",
  async (id) => {
    try {
      console.log(id);
      //Creating API Call using base url (/api/printClosing/:id)
      return await axios
        .get(`${ENDPOINTS.PRINTCLOSE}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);

//ADD CLOSING AXIOS CALL USING ASYNC THUNK
export const addClosing = createAsyncThunk("addClosing", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/closings)
    return await axios.post(ENDPOINTS.CLOSE, Data).then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
  }
});

export const deleteClosing = createAsyncThunk("deleteClosing", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/sales/:id)
    return await axios
      .delete(`${ENDPOINTS.CLOSE}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});
//UPDATE PRODUCT AXIOS CALL USING ASYNC THUNK
export const updateProduct = createAsyncThunk(
  "updateProduct",
  async (initData) => {
    try {
      //De Structuring data
      const { id, Data } = initData;

      //Creating API call using ENDPOINTS as Base URL (/api/products/:id)
      return await axios
        .put(`${ENDPOINTS.PRODUCT}/${id}`, Data)
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data;
    }
  }
);
//DELETE SALE AXIOS CALL USING ASYNC THUNK
export const deleteSale = createAsyncThunk("deleteSale", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/sales/:id)
    return await axios
      .delete(`${ENDPOINTS.SALE}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

//Creating the closing slice
export const closingSlice = createSlice({
  name: "closings",
  initialState: {
    data: [],
    current: {},
    errors: [],
    closed: false,
    totalRecord: 0,
  },
  reducers: {
    clearClosings() {
      return {
        data: [],
        current: {},
        closed: false,
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
    //@used For     GET SALES
    //@Data         Data stored in state
    builder.addCase(getSaleClosings.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
       
        //First Removing all the previous page products
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const closing = { ...item, id: item.id };
          //Here we are setting the fetched products in redux store
          return state.data.push(closing);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });

    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET CLOSNG
    //@Data         Data stored in state
    builder.addCase(getTodaysClosing.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        //Here we are setting total number of records in redux store
        state.closed = actions.payload.data;
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE SALE
    //@Response     Date Stored in State current
    builder.addCase(getSingleSale.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        //Set state
        return {
          ...state,
          current: action.payload.data[0],
        };
      }
    });

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET Print Report
    //@Response     Date Stored in State current
    builder.addCase(getPrintClosingReport.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        const url = action.payload.url;

        console.log("Check th pdf url => ", url)

        // Normalize backslashes and use RegExp to find exact /backend/ folder
        const normalizedUrl = url.replace(/\\/g, "/");

        // Match everything after "/backend/"
        const match = normalizedUrl.match(/\/backend\/(.+)$/);

        const relativePath = match ? `/${match[1]}` : "";

        // const fullUrl = DOMAIN + relativePath;
        const fullUrl = DOMAIN + url;


        // Open the new PDF in a new tab
        window.open(fullUrl, "_blank");

        // Optionally, revoke the object URL after use (for memory cleanup)
      // window.URL.revokeObjectURL(fullUrl);
      }
    });
    //@CaseNo       02
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Closing
    //@Response     Success Alert
    builder.addCase(addClosing.fulfilled, (state, action) => {

     
      //Check for errors
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for success status
      if (action.payload?.success === true) {
        // console.log(action.payload.product);
        //toast
        toast(action.payload.msg, { position: "top-right", type: "success" });

        return {
          ...state,
          errors: [],
        };
      }
    });
    //
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE SALE
    //@Data         Filtered data stored
    builder.addCase(deleteSale.fulfilled, (state, action) => {
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

    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE SALE
    //@Data         Filtered data stored
    builder.addCase(deleteClosing.fulfilled, (state, action) => {
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
export const { clearClosings } = closingSlice.actions;
export default closingSlice.reducer;
