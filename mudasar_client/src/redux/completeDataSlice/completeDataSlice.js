import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";


//GET ALL All Products AXIOS CALL USING ASYNC THUNK
export const getAllProducts = createAsyncThunk("getAllProducts", async () => {
    try {
      return await axios
        .get(
          `${ENDPOINTS.ALLPRODUCT}`
        )
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data.error[0];
    }
});

//GET ALL All Machines AXIOS CALL USING ASYNC THUNK
export const getAllMachines = createAsyncThunk("getAllMachines", async () => {
  try {
    return await axios
      .get(
        `${ENDPOINTS.ALLMACHINE}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//GET ALL CURRENT READINGS AXIOS CALL USING ASYNC THUNK
export const getCurrentReadings = createAsyncThunk("getCurrentReadings", async () => {
  try {
    return await axios
      .get(
        `${ENDPOINTS.CURRENTREADING}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});
//GET ALL CURRENT PRICES AXIOS CALL USING ASYNC THUNK
export const getCurrentPrices = createAsyncThunk("getCurrentPrices", async () => {
  try {
    return await axios
      .get(
        `${ENDPOINTS.CURRENTPRICE}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});
//GET ALL EMPLOYEES AXIOS CALL USING ASYNC THUNK
export const getAllEmployees = createAsyncThunk("getAllEmployees", async () => {
  try {
    return await axios
      .get(
        `${ENDPOINTS.ALLEMPLOYEE}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
})

//GET ALL ACTIVE CUSTOMERS AXIOS CALL USING ASYNC THUNK
export const getAllActiveCustomers = createAsyncThunk("getAllActiveCustomers", async () => {
  try {
    return await axios
      .get(
        `${ENDPOINTS.ALLCUSTOMERS}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
})

//GET ALL ACTIVE SUPPLIERS AXIOS CALL USING ASYNC THUNK
export const getAllActiveSuppliers = createAsyncThunk("getAllActiveSuppliers", async () => {
  try {
    return await axios
      .get(
        `${ENDPOINTS.ALLSUPPLIERS}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
})
//GET ALL EMPLOYEE ADVANCES AXIOS CALL USING ASYNC THUNK
export const getAllActiveAdvances = createAsyncThunk("getAllActiveAdvances", async () => {
  try {
    return await axios
      .get(
        `${ENDPOINTS.ALLADVANCE}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
})
//GET ALL All STOCKS AXIOS CALL USING ASYNC THUNK
export const getAllStocks = createAsyncThunk("getAllStocks", async () => {
  try {
    return await axios
      .get(
        `${ENDPOINTS.ALLSTOCK}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//Creating Customers Slice
export const completeDataSlice = createSlice({
    name: "completeData",
    initialState: {
      products: [],
      machines: [],
      readings: [],
      prices: [],
      customers: [],
      suppliers: [],
      employees: [],
      advances: [],
      stocks: []
    },
    reducers: {
      cleardata() {
        return {
            products: [],
            readings: [],
            prices: [],
            machines: [],
            customers: [],
            suppliers: [],
            advances: [],
            employees: [],
            stocks: []
        };
      },

        // ✅ Clear Active customers item
    clearAllActiveCustomers(state) {
      state.customers = [];
    },
    },
    extraReducers: (builder) => {
      //@CaseNo       01
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET ALL ACTIVE EMPLOYEES
      //@Data         Data stored in state
      builder.addCase(getAllEmployees.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the previous page customers
          state.employees = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const employee = { ...item, id: item.id };
            //Here we are setting the fetched customers in redux store
            return state.employees.push(employee);
          });
        
        }
      }); 
      //@CaseNo       01
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET ALL ACTIVE EMPLOYEES ADVANCES
      //@Data         Data stored in state
      builder.addCase(getAllActiveAdvances.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the advances
          state.advances = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const advance = { ...item, id: item.id };
            //Here we are setting the fetched advances in redux store
            return state.advances.push(advance);
          });
        
        }
      }); 
      //@CaseNo       01
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET ALL ACTIVE CUSTOMERs
      //@Data         Data stored in state
      builder.addCase(getAllActiveCustomers.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the active customers
          state.customers = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const customer = { ...item, id: item.id };
            //Here we are setting the fetched active customers in redux store
            return state.customers.push(customer);
          });
        
        }
      }); 
        //@CaseNo       01
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET ALL ACTIVE CUSTOMERs
      //@Data         Data stored in state
      builder.addCase(getAllActiveSuppliers.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the active customers
          state.suppliers = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const supplier = { ...item, id: item.id };
            //Here we are setting the fetched active supplier in redux store
            return state.suppliers.push(supplier);
          });
        
        }
      }); 
      //@CaseNo       01
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET ALL CURRENT READINGS
      //@Data         Data stored in state
      builder.addCase(getCurrentReadings.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the readings
          state.readings = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const reading = { ...item, id: item.id };
            //Here we are setting the fetched readings in redux store
            return state.readings.push(reading);
          });
        
        }
      }); 
      //@CaseNo       01
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET ALL ACTIVE PRODUCTS
      //@Data         Data stored in state
      builder.addCase(getAllProducts.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the previous page customers
          state.products = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const product = { ...item, id: item.id };
            //Here we are setting the fetched customers in redux store
            return state.products.push(product);
          });
        
        }
      }); 
      //@CaseNo       01
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET CURRENT PRICES
      //@Data         Data stored in state
      builder.addCase(getCurrentPrices.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the prices
          state.prices = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const price = { ...item, id: item.id };
            //Here we are setting the fetched prices in redux store
            return state.prices.push(price);
          });
        
        }
      }); 
      
      //@CaseNo       01
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET ALL ACTIVE MACHINES
      //@Data         Data stored in state
      builder.addCase(getAllMachines.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the previous page machines
          state.machines = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const machine = { ...item, id: item.id };
            //Here we are setting the fetched machines in redux store
            return state.machines.push(machine);
          });
        
        }
      }); 
      //@CaseNo       01
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET ALL STOCKS
      //@Data         Data stored in state
      builder.addCase(getAllStocks.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the previous page customers
          state.products = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const product = { ...item, id: item.id };
            //Here we are setting the fetched customers in redux store
            return state.stocks.push(product);
          });
        
        }
      }); 
      
    },
  });

  //Export Reducer functions
export const { cleardata, clearAllActiveCustomers } = completeDataSlice.actions;
export default completeDataSlice.reducer;