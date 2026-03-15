import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../backend/API";

//GET ALL MACHINES AXIOS CALL USING ASYNC THUNK
export const getMachines = createAsyncThunk("getMachines", async (initData) => {
    try {
      const { field, operator, sort, page, searchInput } =
        initData;
       
      //Creating API call using ENDPOINTS as Base URL (/api/machines)
      console.log("Field => ", field, "Operator =>", operator, "sort => ", sort, "Page =>", page, "Search Input =>", searchInput)
      return await axios
        .get(
          `${ENDPOINTS.MACHINE}?field=${field}&operator=${operator}&searchInput=${searchInput}&page=${page}&sort=${sort}`
        )
        .then((res) => res.data);
    } catch (error) {
      //Incase of error catch error
      return error.response.data.error[0];
    }
  });
  
  //GET SINGLE MACHINE AXIOS CALL USING ASYNC THUNK
  export const getSingleMachine = createAsyncThunk("getSingleMachine", async (id) => {
    try {
      //Creating API Call using base url (/api/machines/:id)
      return await axios.get(`${ENDPOINTS.MACHINE}/${id}`).then(res => res.data)
    } catch (error) {
      //In case of error
      return error.response.data.error[0]
    }
  })
  //ADD MACHINE AXIOS CALL USING ASYNC THUNK
  export const addMachine = createAsyncThunk("addMachine", async (Data) => {
    try {
      //Creating API call using ENDPOINTS as Base URL (/api/machines)
      return await axios
        .post(ENDPOINTS.MACHINE, Data)
        .then((res) => res.data);
    } catch (error) {
        //Incase of error catch error
        return error.response.data
    }
  });
  //UPDATE MACHINE AXIOS CALL USING ASYNC THUNK
  export const updateMachine = createAsyncThunk("updateMachine", async (initData) => {
    try {
      //De Structuring data
      const {id, Data} = initData
    
      //Creating API call using ENDPOINTS as Base URL (/api/machines/:id)
      return await axios.put(`${ENDPOINTS.MACHINE}/${id}`, Data).then(res => res.data)
    } catch (error) {
     
  
      //Incase of error catch error
      return error.response.data
      
    }
  })
  //DELETE MACHINE AXIOS CALL USING ASYNC THUNK
  export const deleteMachine = createAsyncThunk("deleteMachine", async (id) => {
    try {
      //Creating API Call using ENDPOINTS as Base URL (/api/machines/:id)
      return await axios
        .delete(`${ENDPOINTS.MACHINE}/${id}`)
        .then((res) => res.data);
    } catch (error) {
      return error.response.data.error[0];
    }
  });


//Creating the machine slice 
export const machineSlice = createSlice({
    name: "machines",
    initialState: {
        current: {},
        data: [],
        totalRecord: 0,
        errors: [],
    },
    reducers: {
        clearMachines(){
            return {
                current: {},
                data: [],
                totalRecord: 0,
                errors: []
            }
        },

        //Clear current machine 
        clearCurrentMachine(state){
          state.current = {}
        }
    },
    extraReducers: (builder)=>{
         //@CaseNo       01
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET MACHINES
    //@Data         Data stored in state
    builder.addCase(getMachines.fulfilled, (state, actions) => {
        if (actions.payload.success === true) {
          state.data = [];
          actions.payload.data.map((item) => {
            return state.data.push(item);
          });
          state.totalRecord = actions.payload.totalRecords;
        }
      });
      
      //@CaseNo       03
      //@Request      GET
      //@Status       Success
      //@Loading      False
      //@used For     GET SINGLE MACHINE
      //@Response     Date Stored in State current
      builder.addCase(getSingleMachine.fulfilled, (state, action)=> {
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
      //@used for     Add Machine
      //@Response     Success Alert
      builder.addCase(addMachine.fulfilled, (state, action) => {
       //Check for errors
      if (action.payload?.errors?.length > 0) {
        return {
          ...state,
          errors: action.payload.errors,
        };
      }
      //Check for success status
      if (action.payload?.success === true) {
        //toast
        toast(action.payload.msg, { position: "top-right", type: "success" });

        console.log("TOtal record => ", action.payload.totalRecord)
        const machine = { ...action.payload.machine };

        //If items are 5 then remove one item from screen and add ne item
        if (state.data.length === 5) {
          let popedState = []; // Creating empty array
          //Inserting all items except last one
          state.data.forEach(
            (item, index) => index < 4 && popedState.push(item)
          );
          return {
            ...state,
            data: [machine, ...popedState],
            totalRecord: action.payload.totalRecord,
            errors: [],
          };
        } else {
          return {
            ...state,
            data: [machine, ...state.data],
            totalRecord: action.payload.totalRecord,
            errors: [],
          };
        }
      }
      })
  
      //@CaseNo       05
      //@Request      PUT
      //@Status       Success
      //@Loading      False
      //@used For     Update Machine
      //@Response     Success Alert
      builder.addCase(updateMachine.fulfilled, (state, action)=> {
        
        if(action.payload?.errors?.length > 0){
          return {
            ...state,
            errors: action.payload.errors
          }
        }
        //Check for Success
        if(action.payload.success === true){
         
          const updatedMachine = { ...action.payload.updated };
          toast(action.payload.msg, {position: "top-right", type: "success"})
          return {
            ...state,
            data: state.data.map(item =>
              item.id === action.payload.updated.id ? updatedMachine : item
            ),
            errors: []
          }
        }
      })
      //@CaseNo       05
      //@Request      DELETE
      //@Status       Success
      //@Loading      False
      //@used for     DELETE MACHINE
      //@Data         Filtered data stored
      builder.addCase(deleteMachine.fulfilled, (state, action) => {
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

//export 
export const {clearMachines, clearCurrentMachine} = machineSlice.actions
export default machineSlice.reducer