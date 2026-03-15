import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ENDPOINTS } from "../../backend/API";
import { toast } from "react-toastify";


//GET ALL SALES AXIOS CALL USING ASYNC THUNK
export const getSales = createAsyncThunk("getSales", async (initData) => {
  const { field, operator, sort, page, searchInput, startDate, endDate } = initData || {};
  const params = new URLSearchParams({
    field: field ?? "",
    operator: operator ?? "",
    searchInput: searchInput ?? "",
    page: page ?? 0,
    sort: sort ?? -1,
    startDate: startDate ?? "",
    endDate: endDate ?? "",
  });
  const res = await axios.get(`${ENDPOINTS.SALE}?${params.toString()}`);
  return res.data;
});

//GET SINGLE SALE AXIOS CALL USING ASYNC THUNK
export const getSingleSale = createAsyncThunk(
  "getSingleProduct",
  async (id) => {
    try {
      console.log(id)
      //Creating API Call using base url (/api/sales/:id)
      return await axios
        .get(`${ENDPOINTS.SALE}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);

//ADD SALE AXIOS CALL USING ASYNC THUNK
export const addSale = createAsyncThunk("addSale", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/sales)
    return await axios.post(ENDPOINTS.SALE, Data).then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data;
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

//Creating the sale slice
export const saleSlice = createSlice({
  name: "sales",
  initialState: {
    data: [],
    current: {},
    errors: [],
    totalRecord: 0,
  },
  reducers: {
    clearSales() {
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
    //@used For     GET SALES
    //@Data         Data stored in state
    builder.addCase(getSales.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload && payload.success === true && Array.isArray(payload.data)) {
        state.data = payload.data.map((item) => ({ ...item, id: item.id }));
        state.totalRecord = typeof payload.totalRecords === "number" ? payload.totalRecords : 0;
        state.errors = [];
      } else {
        state.data = [];
        state.errors = payload?.errors?.msg ? [payload.errors] : [];
      }
    });
    builder.addCase(getSales.rejected, (state, action) => {
      state.data = [];
      state.errors = [{ msg: action.error?.message || "Failed to load sales" }];
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

    //@CaseNo       02
    //@Request      POST
    //@Status       Success
    //@Loading      False
    //@used for     Add Sale
    //@Response     Success Alert
    builder.addCase(addSale.fulfilled, (state, action) => {
      console.log(action.payload)
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
        //Modifying id
        // const product = {
        //   ...action.payload.product[0],
        //   id: action.payload.product[0].id,
        // };
        return {
          ...state,
        //   data: [...state.data, product],
          errors: [],
        };
      }
    });

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Product
    //@Response     Success Alert
    builder.addCase(updateProduct.fulfilled, (state, action)=> {
      
      if(action.payload?.errors?.length > 0){
        return {
          ...state,
          errors: action.payload.errors
        }
      }
      //Check for Success
      if(action.payload.success === true){
       
        const updatedProduct = {...action.payload.updated[0], id: action.payload.updated[0].id}
        //Show Alert
        toast(action.payload.msg, {position: "top-right", type: "success"})
        return {
          ...state,
          data: state.data.map(item => 
            item.id === action.payload.updated[0].id ? updatedProduct : item
          ),
          errors: []
        }
      }
    })

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
  },
});

//export
export const { clearSales } = saleSlice.actions;
export default saleSlice.reducer;
