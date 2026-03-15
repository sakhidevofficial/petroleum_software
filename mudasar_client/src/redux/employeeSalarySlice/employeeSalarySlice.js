import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../backend/API";
import axios from "axios";
import { toast } from "react-toastify";

//GET ALL EMPLOYEES SALARIES AXIOS CALL USING ASYNC THUNK
export const getEmployeeSalaries = createAsyncThunk("getEmployeeSalaries", async (initData) => {
  try {
    const { field, operator, sort, page, startDate, endDate, searchInput } =
      initData;
     
    //Creating API call using ENDPOINTS as Base URL (/api/employeeSalary)
    console.log("Field => ", field, "Operator =>", operator, "sort => ", sort, "startDate => ", startDate, "EndDate => ",endDate, "Page =>", page, "Search Input =>", searchInput)
    return await axios
      .get(
        `${ENDPOINTS.EMPLOYEESALARY}?field=${field}&operator=${operator}&searchInput=${searchInput}&startDate=${startDate}&endDate=${endDate}&page=${page}&sort=${sort}`
      )
      .then((res) => res.data);
  } catch (error) {
    //Incase of error catch error
    return error.response.data.error[0];
  }
});

//GET SINGLE EMPLOYEE SALARY AXIOS CALL USING ASYNC THUNK
export const getSingleEmployeePayment = createAsyncThunk("getSingleEmployeePayment", async (id) => {
  try {
    //Creating API Call using base url (/api/supplierpayments/:id)
    return await axios.get(`${ENDPOINTS.SUPPLIERPAYMENT}/${id}`).then(res => res.data)
  } catch (error) {
    //In case of error
    return error.response.data.error[0]
  }
})
//ADD EMPLOYEE SALARY AXIOS CALL USING ASYNC THUNK
export const addEmployeeSalary = createAsyncThunk("addEmployeeSalary", async (Data) => {
  try {
    //Creating API call using ENDPOINTS as Base URL (/api/employeeSalary)
    return await axios
      .post(ENDPOINTS.EMPLOYEESALARY, Data)
      .then((res) => res.data);
  } catch (error) {
      //Incase of error catch error
      return error.response.data
  }
});
//UPDATE EMPLOYEE AXIOS CALL USING ASYNC THUNK
export const updateEmployeeSalary = createAsyncThunk("updateEmployeeSalary", async (initData) => {
  try {
    //De Structuring data
    const {id, Data} = initData
  
    //Creating API call using ENDPOINTS as Base URL (/api/employeeSalary/:id)
    return await axios.put(`${ENDPOINTS.EMPLOYEESALARY}/${id}`, Data).then(res => res.data)
  } catch (error) {
   

    //Incase of error catch error
    return error.response.data
    
  }
})
//DELETE EMPLOYEE SALARY AXIOS CALL USING ASYNC THUNK
export const deleteEmployeeSalary = createAsyncThunk("deleteEmployeeSalary", async (id) => {
  try {
    //Creating API Call using ENDPOINTS as Base URL (/api/employeeSalary/:id)
    return await axios
      .delete(`${ENDPOINTS.EMPLOYEESALARY}/${id}`)
      .then((res) => res.data);
  } catch (error) {
    return error.response.data.error[0];
  }
});

//Creating Employees Salary Slice
export const employeeSalarySlice = createSlice({
  name: "salaries",
  initialState: {
    current: {}, 
    data: [],
    totalRecord: 0,
    errors: []
  },
  reducers: {
    clearEmployeeSalaries() {
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
    //@used For     GET EMPLOYEE SALARIES
    //@Data         Data stored in state
    builder.addCase(getEmployeeSalaries.fulfilled, (state, actions) => {
      //Check for request success
      if (actions.payload.success === true) {
        //First Removing all the previous page employee payments
        state.data = [];
        //Using map iterate each item and push into the state
        actions.payload.data.map((item) => {
          //Here we are modifying the _id to id of each record
          const employeePayment = { ...item, id: item.id };
          //Here we are setting the fetched employee payments in redux store
          return state.data.push(employeePayment);
        });
        //Here we are setting total number of records in redux store
        state.totalRecord = actions.payload.totalRecords;
      }
    });
    
    //@CaseNo       03
    //@Request      GET
    //@Status       Success
    //@Loading      False
    //@used For     GET SINGLE EMPLOYEE PAYMENT
    //@Response     Date Stored in State current
    builder.addCase(getSingleEmployeePayment.fulfilled, (state, action)=> {
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
    //@used for     Add Employee Salary
    //@Response     Success Alert
    builder.addCase(addEmployeeSalary.fulfilled, (state, action) => {
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
          const salary = {...action.payload.salary, id: action.payload.salary.id}
     
          //If items are 5 then remove one item from screen and add ne item
          if(state.data.length === 5){
            let popedState = [] // Creating empty array
            //Inserting all items except last one
            state.data.forEach((item, index) => index < 4 && popedState.push(item))
            return {
              ...state,
              data: [salary, ...popedState ],
              totalRecord: action.payload.totalRecord,
              errors: []
            }
          } else {
            return {
              ...state,
              data: [salary, ...state.data ],
              totalRecord: action.payload.totalRecord,
              errors: []
            }
          }
      }
    })

    //@CaseNo       05
    //@Request      PUT
    //@Status       Success
    //@Loading      False
    //@used For     Update Employee Salary
    //@Response     Success Alert
    builder.addCase(updateEmployeeSalary.fulfilled, (state, action)=> {
      
      if(action.payload?.errors?.length > 0){
        return {
          ...state,
          errors: action.payload.errors
        }
      }
      //Check for Success
      if(action.payload.success === true){
       
        const updatedSupplierPayment = {...action.payload.updated[0], id: action.payload.updated[0].id}
        //Show Alert
        toast(action.payload.msg, {position: "top-right", type: "success"})
        return {
          ...state,
          data: state.data.map(item => 
            item.id === action.payload.updated[0].id ? updatedSupplierPayment : item
          ),
          errors: []
        }
      }
    })
    //@CaseNo       05
    //@Request      DELETE
    //@Status       Success
    //@Loading      False
    //@used for     DELETE EMPLOYEE SALARY
    //@Data         Filtered data stored
    builder.addCase(deleteEmployeeSalary.fulfilled, (state, action) => {
      //Check for errors
      if(action.payload?.errors?.length > 0){
        return {
          ...state,
          errors: action.payload.errors
        }
      }
      //Check for request success
      if (action.payload.success === true) {
        
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
export const { clearEmployeeSalaries } = employeeSalarySlice.actions;
export default employeeSalarySlice.reducer;
