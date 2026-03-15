import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

//GET ALL SUPPLIERS AXIOS CALL USING ASYNC THUNK
export const getSuppliers = createAsyncThunk("getSuppliers", async (initData) => {
  try {
    const { field, operator, sort, page, searchInput } =
      initData;
     
    //Creating API call using ENDPOINTS as Base URL (/api/suppliers)
    return await axios
      .get(
        `${ENDPOINTS.SUPPLIER}?field=${field}&operator=${operator}&searchInput=${searchInput}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data); 
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//GET SINGLE SUPPLIER AXIOS CALL USING ASYNC THUNK
export const getSingleSupplier = createAsyncThunk("getSingleCustomer", async (id) => {
  try {
    //Creating API Call using base url (/api/suppliers/:id)
    return await axios.get(`${ENDPOINTS.SUPPLIER}/${id}`).then(res => res.data)
  } catch (error) {
    //In case of error
    return error.response.data.error[0]
  }
})
//ADD SUPPLIER AXIOS CALL USING ASYNC THUNK
export const addSupplier = createAsyncThunk("addSupplier", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/suppliers)
    return await axios
      .post(ENDPOINTS.SUPPLIER, Data)
      .then((res) => res.data);
  } catch (error) {
      //Incase of error catch error
      return error.response.data
  }
});
//UPDATE SUPPLIER AXIOS CALL USING ASYNC THUNK
export const updateSupplier = createAsyncThunk("updateSupplier", async (initData) => {
  try {
    //De Structuring data
    const {id, Data} = initData
    //Creating API call using ENDPOINTS as Base URL (/api/suppliers/:id)
    return await axios.put(`${ENDPOINTS.SUPPLIER}/${id}`, Data).then(res => res.data)
  } catch (error) {
    //Incase of error catch error
    return error.response.data
  }
})
//DELETE SUPPLIER AXIOS CALL USING ASYNC THUNK
export const deleteSupplier = createAsyncThunk("deleteSupplier", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/suppliers/:id)
    return await axios
      .delete(`${ENDPOINTS.SUPPLIER}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});
//Creating Suppliers Slice
export const supplierSlice = createSlice({
  name: "suppliers",
  initialState: {
    current: {}, 
    data: [],
    totalRecord: 0,
    errors: []
  },
  reducers: {
    clearSuppliers() {
      return {
        current: {},
        data: [],
        totalRecord: 0,
        errors: []
      };
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SUPPLIERS
    //@Data         Data stored in state
    builder.addCase(getSuppliers.fulfilled, (state, actions) => {

      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page suppliers
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const supplier = { ...item, id: item.id };
          //Here we are setting the fetched suppliers in redux store
          return state.data.push(supplier);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });
    
    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE SUPPLIER
    //@Response     Date Stored in State current
    builder.addCase(getSingleSupplier.fulfilled, (state, action)=> {
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
    //@used for     Add Supplier 
    //@Response     Success Alert
    builder.addCase(addSupplier.fulfilled, (state, action) => {
       // Handle errors
      if (action.payload?.errors?.length > 0) {
        state.errors = action.payload.errors;
        return;
      }

      // Handle success
      if (action.payload?.success === true) {
        toast(action.payload.msg, { position: "top-right", type: "success" });
        
        const supplier = {
          ...action.payload.supplier,
          id: action.payload.supplier.id,
        };

        // Maintain maximum 5 items in the list
        if (state.data.length === 5) {
          const poppedState = state.data.slice(0, 4);
          state.data = [supplier, ...poppedState];
        } else {
          state.data = [supplier, ...state.data];
        } 
        
        state.totalRecord = action.payload.totalRecord;
        state.errors = [];
      }
    })

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Supplier
    //@Response     Success Alert
    builder.addCase(updateSupplier.fulfilled, (state, action)=> {
      
      if(action.payload?.errors?.length > 0){
        return {
          ...state,
          errors: action.payload.errors
        }
      }
      //Check for Success
      if(action.payload.success === true){
       
        const updatedSupplier = {...action.payload.updated, id: action.payload.updated.id}
        //Show Alert
        toast(action.payload.msg, {position: "top-right", type: "success"})
        return {
          ...state,
          data: state.data.map(item => 
            item.id === action.payload.updated.id ? updatedSupplier : item
          ),
          errors: []
        }
      }
    })
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE SUPPLIER
    //@Data         Filtered data stored
    builder.addCase(deleteSupplier.fulfilled, (state, action) => {
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
export const { clearSuppliers } = supplierSlice.actions;
export default supplierSlice.reducer;
