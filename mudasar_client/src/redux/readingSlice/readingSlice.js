import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../backend/API";
//GET ALL READINGS AXIOS CALL USING ASYNC THUNK
export const getReadings = createAsyncThunk("getReadings", async (initData) => {
    try {
      const { field, operator, startDate, endDate, sort, page, searchInput } =
        initData;
       
      //Creating API call using ENDPOINTS as Base URL (/api/readings)
      console.log("Field => ", field, "Operator =>", operator,  "Start Date =>", startDate, "endDate => ", endDate, " sort => ", sort, "Page =>", page, "Search Input =>", searchInput)
      return await axios
        .get(
          `${ENDPOINTS.READING}?field=${field}&startDate=${startDate}&endDate=${endDate}&operator=${operator}&searchInput=${searchInput}&page=${page}&sort=${sort}`
        )
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data.error[0];
    }
  });

//ADD READING AXIOS CALL USING ASYNC THUNK
export const addReading = createAsyncThunk("addReading", async (data) => {
    try {
        //Creating API call using ENDPOINTS as Base URL (/api/readings)
        return await axios
          .post(ENDPOINTS.READING, data)
          .then((res) => res.data);
      } catch (error) {
          //Incase of error catch error
          return error.response.data
      }
})

  //DELETE READING AXIOS CALL USING ASYNC THUNK
  export const deleteReading = createAsyncThunk("deleteReading", async (id) => {
    try {
      //Creating API Call using ENDPOINTS as Base URL (/api/readings/:id)
      return await axios
        .delete(`${ENDPOINTS.READING}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      return error.response.data.error[0];
    }
  });

//create new slice 
export const readingSlice = createSlice({
    name: "readings",
    initialState: {
        current: {},
        data: [],
        totalReadings: 0,
        errors: []
    },
    reducers: {
        clearReadings(){
            return {
                current: {},
                data: [],
                totalReadings: 0,
                errors: []
            }
        }
    },
    extraReducers: (builder) => {

               //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET READINGS
    //@Data         Data stored in state
    builder.addCase(getReadings.fulfilled, (state, actions) => {
        //Check for request success
        if (actions.payload.success === true) {
          //First Removing all the previous page readings
          state.data = [];
          //Using map iterate each item and push into the state
          actions.payload.data.map((item) => {
            //Here we are modifying the _id to id of each record
            const reading = { ...item, id: item.id };
            //Here we are setting the fetched readings in redux store
            return state.data.push(reading);
          });
          //Here we are setting total number of records in redux store
          state.totalRecord = actions.payload.totalRecords;
        }
      });

    //@CaseNo       04
      //@Request      POST
      //@Status       Success
      //@Loading      False
      //@used for     Add Reading
      //@Response     Success Alert
      builder.addCase(addReading.fulfilled, (state, action) => {
        console.log(action.payload)
        //Check for errors
        if(action.payload?.errors?.length > 0){
          return {
            ...state,
            errors: action.payload.errors
          }
        }
        //Check for success status
        if(action.payload?.success === true){
          //toast
          toast(action.payload.msg, {position: "top-right", type: "success"})
          //Modifying id
          const reading = {...action.payload.reading[0], id: action.payload.reading[0].id}
          return {
            ...state,
            data: [...state.data, reading],
            errors: []
          }
        }
      })

        //@CaseNo       05
      //@Request      DELETE
      //@Status       Success
      //@Loading      False
      //@used for     DELETE READING
      //@Data         Filtered data stored
      builder.addCase(deleteReading.fulfilled, (state, action) => {
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
    }
})


export const {clearReadings} = readingSlice.actions
export default readingSlice.reducer