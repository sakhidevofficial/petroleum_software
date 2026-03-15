import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ENDPOINTS } from "../../backend/API";
import { toast } from "react-toastify";


//GET ALL STOCKS AXIOS CALL USING ASYNC THUNK
export const getStocks = createAsyncThunk("getStocks", async (initData) => {
  try {
    const { field, operator, sort, page, searchInput } = initData;

    //Creating API call using ENDPOINTS as Base URL (/api/products)
    return await axios
      .get(
        `${ENDPOINTS.STOCK}?field=${field}&operator=${operator}&searchInput=${searchInput}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//GET SINGLE PRODUCT AXIOS CALL USING ASYNC THUNK
export const getSingleProduct = createAsyncThunk(
  "getSingleProduct",
  async (id) => {
    try {
      //Creating API Call using base url (/api/products/:id)
      return await axios
        .get(`${ENDPOINTS.PRODUCT}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
); 





//Creating the stock slice
export const stockSlice = createSlice({
  name: "stocks",
  initialState: {
    data: [],
    current: {},
    errors: [],
    totalRecord: 0,
  },
  reducers: {
    clearStocks() {
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
    //@used For     GET PRODUCTS
    //@Data         Data stored in state
    builder.addCase(getStocks.fulfilled, (state, actions) => {
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
    //@used For     GET SINGLE PRODUCT
    //@Response     Date Stored in State current
    // builder.addCase(getSingleProduct.fulfilled, (state, action) => {
    //   //Checking for success
    //   if (action.payload.success === true) {
    //     //Set state
    //     return {
    //       ...state,
    //       current: action.payload.data[0],
    //     };
    //   }
    // });

    //@CaseNo       02
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Product
    //@Response     Success Alert
    // builder.addCase(addProduct.fulfilled, (state, action) => {
    //   //Check for errors
    //   if (action.payload?.errors?.length > 0) {
    //     return {
    //       ...state,
    //       errors: action.payload.errors,
    //     };
    //   }
    //   //Check for success status
    //   if (action.payload?.success === true) {
    //     console.log(action.payload.product);
    //     //toast
    //     toast(action.payload.msg, { position: "top-right", type: "success" });
    //     //Modifying id
    //     const product = {
    //       ...action.payload.product[0],
    //       id: action.payload.product[0].id,
    //     };
    //     return {
    //       ...state,
    //       data: [...state.data, product],
    //       errors: [],
    //     };
    //   }
    // });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Product
    //@Response     Success Alert
    // builder.addCase(updateProduct.fulfilled, (state, action)=> {
      
    //   if(action.payload?.errors?.length > 0){
    //     return {
    //       ...state,
    //       errors: action.payload.errors
    //     }
    //   }
    //   //Check for Success
    //   if(action.payload.success === true){
       
    //     const updatedProduct = {...action.payload.updated[0], id: action.payload.updated[0].id}
    //     //Show Alert
    //     toast(action.payload.msg, {position: "top-right", type: "success"})
    //     return {
    //       ...state,
    //       data: state.data.map(item => 
    //         item.id === action.payload.updated[0].id ? updatedProduct : item
    //       ),
    //       errors: []
    //     }
    //   }
    // })

    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE PRODUCT
    //@Data         Filtered data stored
    // builder.addCase(deleteProduct.fulfilled, (state, action) => {
    //   //Check for request success
    //   if (action.payload.success === true) {
    //     //Set Alert
    //     toast(action.payload.msg, { position: "top-right", type: "error" });
    //     return {
    //       ...state,
    //       data: [...state.data.filter((item) => item.id !== parseInt(action.payload.id))],
    //       totalRecord: action.payload.totalRecords,
    //     };
    //   }
    // });
  },
});

//export
export const { clearStocks } = stockSlice.actions;
export default stockSlice.reducer;
