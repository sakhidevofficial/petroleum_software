import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

//GET ALL CUSTOMER PAYMENTS AXIOS CALL USING ASYNC THUNK
export const getCustomerPayments = createAsyncThunk("getCustomerPayments", async (initData) => {
  try {
    const { field, operator, sort, page, startDate, endDate, searchInput } =
      initData;
     
    return await axios
      .get(
        `${ENDPOINTS.CUSTOMERPAYMENT}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//GET SINGLE CUSTOMER PAYMENT AXIOS CALL USING ASYNC THUNK
export const getSingleCustomerPayment = createAsyncThunk("getSingleCustomerPayment", async (id) => {
  try {
    //Creating API Call using base url (/api/customerpayments/:id)
    return await axios.get(`${ENDPOINTS.CUSTOMERPAYMENT}/${id}`).then(res => res.data)
  } catch (error) {
    //In case of error
    return error.response.data.error[0]
  }
})
//ADD CUSTOMER PAYMENT AXIOS CALL USING ASYNC THUNK
export const addCustomerPayment = createAsyncThunk("addCustomerPayment", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/customerpayments)
    return await axios
      .post(ENDPOINTS.CUSTOMERPAYMENT, Data)
      .then((res) => res.data);
  } catch (error) {
      //Incase of error catch error
      return error.response.data
  }
});
//UPDATE CUSTOMER AXIOS CALL USING ASYNC THUNK
export const updateCustomerPayment = createAsyncThunk("updateCustomerPayment", async (initData) => {
  try {
    //De Structuring data
    const {id, Data} = initData
  
    //Creating API call using ENDPOINTS as Base URL (/api/customerpayments/:id)
    return await axios.put(`${ENDPOINTS.CUSTOMERPAYMENT}/${id}`, Data).then(res => res.data)
  } catch (error) {
   

    //Incase of error catch error
    return error.response.data
    
  }
})
//DELETE CUSTOMER PAYMENT AXIOS CALL USING ASYNC THUNK
export const deleteCustomerPayment = createAsyncThunk("deleteCustomerPayment", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/customerpayments/:id)
    return await axios
      .delete(`${ENDPOINTS.CUSTOMERPAYMENT}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

//Creating Customers Payment Slice
export const customerPaymentSlice = createSlice({
  name: "customerPayments",
  initialState: {
    current: {}, 
    data: [],
    totalRecord: 0,
    errors: []
  },
  reducers: {
    clearCustomerPayments() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: []
      };
    },

     // ✅ Clear only current selected item
    clearCurrentCustomerPayment(state) {
      state.current = {};
    },

  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET CUSTOMER PAYMENTS
    //@Data         Data stored in state
    builder.addCase(getCustomerPayments.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page customer payments
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const customerPayment = { ...item, id: item.id };
          //Here we are setting the fetched customer payments in redux store
          return state.data.push(customerPayment);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });
    
    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE CUSTOMER PAYMENT
    //@Response     Date Stored in State current
    builder.addCase(getSingleCustomerPayment.fulfilled, (state, action)=> {
      //Checking for success
      if(action.payload.success === true){
        //Set state
       return {
        ...state,
        current: action.payload.data
       }
      }
    })

    //@CaseNo       04
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Customer Payment
    //@Response     Success Alert
    builder.addCase(addCustomerPayment.fulfilled, (state, action) => {
      
      // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const customerpayment = {
          ...action.payload.customerpayment[0],
          id: action.payload.customerpayment[0].id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [customerpayment, ...poppedState];
        } else {
          state.data = [customerpayment, ...state.data];
        }
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    })

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Customer Payment
    //@Response     Success Alert
    builder.addCase(updateCustomerPayment.fulfilled, (state, action)=> {
      
      if(action.payload?.errors?.length > 0){
        return {
          ...state,
          errors: action.payload.errors
        }
      }
      //Check for Success
      if(action.payload.success === true){
       
        const updatedCustomerPayment = {...action.payload.updated[0], id: action.payload.updated[0].id}
        //Show Alert
        toast(action.payload.msg, {position: "top-right", type: "success"})
        return {
          ...state,
          data: state.data.map(item => 
            item.id === action.payload.updated[0].id ? updatedCustomerPayment : item
          ),
          errors: []
        }
      }
    })
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE CUSTOMER PAYMENT
    //@Data         Filtered data stored
    builder.addCase(deleteCustomerPayment.fulfilled, (state, action) => {

       //Check for errors
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
          data: [...state.data.filter(
            (item) => item.id !== parseInt(action.payload.id)
          )],
          totalRecord: action.payload.totalRecords,
        };
      }
    });

    
  },
});

//Export Reducer functions
export const { clearCustomerPayments, clearCurrentCustomerPayment } = customerPaymentSlice.actions;
export default customerPaymentSlice.reducer;
