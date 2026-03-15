import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { DOMAIN, ENDPOINTS } from "../../backend/API";
//GET ALL REPORTS AXIOS CALL USING ASYNC THUNK
export const getReports = createAsyncThunk("getReports", async (initData) => {
  try {
    const { startDate, endDate } = initData;

    const res = await axios.get(
      `${ENDPOINTS.REPORT}?startDate=${startDate}&endDate=${endDate}`
    );
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.errors?.msg || error.response?.data?.error?.[0]?.msg || error.message || "Report failed";
    throw new Error(msg);
  }
});

export const getCustomerReports = createAsyncThunk(
  "getCustomerReports",
  async (initData) => {
  try {
    const { customerId, startDate, endDate } = initData;

    const res = await axios.get(
      `${ENDPOINTS.CUSTOMERREPORT}?startDate=${startDate}&endDate=${endDate}&customerId=${customerId}`
    );
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.errors?.msg || error.response?.data?.error?.[0]?.msg || error.message || "Customer report failed";
    throw new Error(msg);
  }
});

//GET PRINT CLOSING AXIOS CALL USING ASYNC THUNK
export const getPrintMonthlyReport = createAsyncThunk(
  "getPrintMonthlyReport",
  async (initData) => {
    try {
      const { startDate, endDate } = initData;
      //Creating API Call using base url (/api/printClosing/:id)
      return await axios
        .get(
          `${ENDPOINTS.PRINTREPORT}?startDate=${startDate}&endDate=${endDate}`
        )
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);

//GET PRINT CLOSING AXIOS CALL USING ASYNC THUNK
export const getPrintCustomerReport = createAsyncThunk(
  "getPrintCustomerReport",
  async (initData) => {
    try {
      const { customerId, startDate, endDate } = initData;
      //Creating API Call using base url (/api/printClosing/:id)
      return await axios
        .get(
          `${ENDPOINTS.PRINTCUSTOMERREPORT}?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`
        )
        .then((res) => res.data);
    } catch (error) {
      //In case of error
      return error.response.data.error[0];
    }
  }
);
export const genReport = createAsyncThunk("genReport", async (initData) => {
  try {
    const { startDate, endDate } = initData;

    //Creating API call using ENDPOINTS as Base URL (/api/reports)
    return await axios
      .get(`${ENDPOINTS.GENREPORT}?startDate=${startDate}&endDate=${endDate}`, {
        responseType: "blob", // Important to specify 'blob' response type for binary data
      })
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//create new slice
export const reportSlice = createSlice({
  name: "reports",
  initialState: {
    data: [],
    customerReports: [],
    errors: [],
  },
  reducers: {
    clearReports() {
      return {
        data: [],
        customerReports: [],
        errors: [],
      };
    },
  },
  extraReducers: (builder) => {
    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET REPORTS
    //@Data         Data stored in state
    builder.addCase(genReport.fulfilled, (state, actions) => {
      // Create a blob from the PDF response
      // const pdfBlob = new Blob([actions.payload], { type: "application/pdf" });

      // // Create a URL for the blob
      // const pdfUrl = window.URL.createObjectURL(pdfBlob);

      if (actions.payload?.url) {
        window.open(`${DOMAIN}${actions.payload.url}`, "_blank");
      }
    });

    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET REPORTS
    //@Data         Data stored in state
    builder.addCase(getReports.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload && payload.success === true && Array.isArray(payload.data)) {
        state.data = payload.data;
        state.errors = [];
      } else {
        state.data = [];
        const errMsg = payload?.errors?.msg || (payload?.errors && typeof payload.errors === "object" ? "Report failed" : "");
        state.errors = errMsg ? [errMsg] : [];
      }
    });
    builder.addCase(getReports.pending, (state) => {
      state.errors = [];
    });
    builder.addCase(getReports.rejected, (state, action) => {
      state.data = [];
      state.errors = [action.error?.message || "Failed to load report"];
    });

    //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET REPORTS
    //@Data         Data stored in state
    builder.addCase(getCustomerReports.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload && payload.success === true && Array.isArray(payload.data)) {
        state.customerReports = payload.data;
      } else {
        state.customerReports = [];
      }
    });
    builder.addCase(getCustomerReports.rejected, (state, action) => {
      state.customerReports = [];
      state.errors = [action.error?.message || "Failed to load customer report"];
    });

    builder.addCase(getPrintMonthlyReport.fulfilled, (state, action) => {
      //Checking for success
      if (action.payload.success === true) {
        // const url = action.payload.url;

        // // Normalize backslashes and use RegExp to find exact /backend/ folder
        // const normalizedUrl = url.replace(/\\/g, "/");

        // // Match everything after "/backend/"
        // const match = normalizedUrl.match(/\/backend\/(.+)$/);

        // const relativePath = match ? `/${match[1]}` : "";

        // const fullUrl = DOMAIN + relativePath;

        // // Open the new PDF in a new tab
        // window.open(fullUrl, "_blank");

        // Optionally, revoke the object URL after use (for memory cleanup)
        // window.URL.revokeObjectURL(fullUrl);
        if (action.payload?.url) {
          window.open(`${DOMAIN}${action.payload.url}`, "_blank");
        }
      }
    });

    builder.addCase(getPrintCustomerReport.fulfilled, (state, action) => {
      if (action.payload?.success === true && action.payload?.url) {
        window.open(`${DOMAIN}${action.payload.url}`, "_blank");
      }
    });
  },
});

export const { clearReports } = reportSlice.actions;
export default reportSlice.reducer;
