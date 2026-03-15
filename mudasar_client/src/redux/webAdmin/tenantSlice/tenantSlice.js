import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

//GET ALL TENANTS AXIOS CALL USING ASYNC THUNK
export const getTenants = createAsyncThunk("getTenants", async (initData) => {
  try {
    const { field, operator, sort, page, searchInput, startDate, endDate } =
      initData;
     
    //Creating API call using ENDPOINTS as Base URL (/api/webadmin/tenants)
    return await axios
      .get(
        `${ENDPOINTS.TENANT_USER}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});
//GET ALL PACKAGES AXIOS CALL USING ASYNC THUNK 
export const getTenantPackages = createAsyncThunk("getTenantPackages", async (status) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL ("/api/webadmin/packages")
    return await axios.get(`${ENDPOINTS.GET_TENANT_PACKAGES}?status=${status}`).then(res => res.data)
  } catch (error) {
    //In case of error handle error
    return error.response.data.error[0]
  }
})
//GET SINGLE TENANT AXIOS CALL USING ASYNC THUNK
export const getSingleTenant = createAsyncThunk("getSingleTenant", async (id) => {
  try {
    //Creating API Call using base url (/api/webadmin/tenants)
    return await axios.get(`${ENDPOINTS.TENANT_USER}/${id}`).then(res => res.data)
  } catch (error) {
    //In case of error
    return error.response.data.error[0]
  }
})
//ADD TENANT AXIOS CALL USING ASYNC THUNK
export const addTenant = createAsyncThunk("addTenant", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/webadmin/tenants)
    return await axios
      .post(ENDPOINTS.TENANT_USER, Data)
      .then((res) => res.data);
  } catch (error) {
    console.log("From Error Catch => ", error.response.data.errors)
    //Incase of error catch error
   error.response.data.errors.forEach(item => {
    toast(item.msg, {position: "top-right", type: "error"})
   });
  }
});
//UPDATE TENANT AXIOS CALL USING ASYNC THUNK
export const updateTenant = createAsyncThunk("updateTenant", async (initData) => {
  try {
    //De Structuring data
    const {id, Data} = initData
    console.log("Checking Data in Slice => ", Data)
    //Creating API call using ENDPOINTS as Base URL (/api/webadmin/tenants)
    return await axios.put(`${ENDPOINTS.TENANT_USER}/${id}`, Data).then(res => res.data)
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0]
    
  }
})
//DELETE TENANT AXIOS CALL USING ASYNC THUNK
export const deleteTenant = createAsyncThunk("deleteTenant", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/webadmin/tenants/:id)
    return await axios
      .delete(`${ENDPOINTS.DELETE_TENANT}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});
//Creating Tenants Slice
export const tenantSlice = createSlice({
  name: "tenants",
  initialState: {
    current: {}, 
    packages: [],
    data: [],
    totalRecord: 0,
  },
  reducers: {
    clearTenants() {
      return {
        current: {},
        packages: [],
        data: [],
        totalRecord: 0,
      };
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET TENANTS
    //@Data         Data stored in state
    builder.addCase(getTenants.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page tenants
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.results.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const tenant = { ...item, id: item.id };
          //Here we are setting the fetched tenants in redux store
          return state.data.push(tenant);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.results.totalRecords;
      }
    });
    
    //@CaseNo       02
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET PACKAGES
    //@Data         Stored in the Packages in State
    builder.addCase(getTenantPackages.fulfilled, (state, action)=> {
      //IN Case of getting success response 
      if(action.payload.success === true){
        // //Empty the state 
        state.packages = []
        // Now set New values 
        state.packages = action.payload.data
      }
    })

    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE TENANT
    //@Response     Date Stored in State current
    builder.addCase(getSingleTenant.fulfilled, (state, action)=> {
      //Checking for success
      if(action.payload.success === true){
        //Set state
        state.current = action.payload.data
      }
    })

    //@CaseNo       04
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add New tenant for Admin Panel
    //@Response     Success Alert
    builder.addCase(addTenant.fulfilled, (state, action) => {
      //Check for success status
      if(action.payload?.success === true){
        //toast
        toast(action.payload.msg, {position: "top-right", type: "success"})
      }
      return state
    })

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update tenant from Admin Panel
    //@Response     Success Alert
    builder.addCase(updateTenant.fulfilled, (state, action)=> {
      //Check for Success
      if(action.payload.success === true){
        //Show Alert
        toast(action.payload.msg, {position: "top-right", type: "success"})
      }
      return state
    })
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE TENANT
    //@Data         Filtered data stored
    builder.addCase(deleteTenant.fulfilled, (state, action) => {
      //Check for request success
      if (action.payload.success === true) {
        //Set Alert
        toast(action.payload.msg, { position: "bottom-right", type: "error" });
        return {
          ...state,
          data: [...state.data]?.filter(
            (item) => item.id !== parseInt(action.payload.id)
          ),
          totalRecord: action.payload.totalRecords,
        };
      }
    });

    
  },
});

//Export Reducer functions
export const { clearTenants } = tenantSlice.actions;
export default tenantSlice.reducer;
