import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
import { DOMAIN, ENDPOINTS } from "../../../backend/API"
// import {store} from "../store"
// import {addAlert} from "../alertSlice/alertSlice"
 


//GET ALL PACKAGES AXIOS CALL USING ASYNC THUNK
export const getPackages = createAsyncThunk("getPackages", async () => {
    try {
        //Creating API call using ENDPOINTS as Base URL
        return axios.get(ENDPOINTS.GET_PACKAGES).then(res => res.data)
    } catch (error) {
        //In case of error catch error
        return error.response.data.error[0]
    }
})
//GET SINGLE PACKAGE AXIOS CALL USING ASYNC THUNK
export const getSinglePackage = createAsyncThunk("getSinglePackage", async (id)=>{
    try {
        //Creating API call using ENDPOINTS as Base URL ("/api/packages/:id")
        return axios.get(`${ENDPOINTS.GET_SINGLE_PACKAGE}/${id}`).then(res=>res.data)
    } catch (error) {
        //In case of error catch error
        return error.response.data.error[0]
    }
})
//ADD NEW PACKAGE AXIOS CALL USING ASYNC THUNK
export const addPackages = createAsyncThunk("addPackages", async (Data)=> {
    try {
        //Creating API call using ENDPOINTS as Base URL
        return await axios.post(ENDPOINTS.ADD_PACKAGE, Data).then(res => res.data)
    } catch (error) {
        //In case of error catch error
        return error.response.data.error[0] 
    }
})
//PUT PACKAGE AXIOS CALL USING AYSNC THUNK
export const updatePackage = createAsyncThunk("updatePackage", async ({id, Data}) => {
    try {
        //Creating API call using ENDPOINTS as Base URL ("/api/packages/:id")
        return await axios.put(`${ENDPOINTS.UPDATE_PACKAGE}/${id}`, Data).then(res => res.data)
    } catch (error) {
        console.log(error)
        //In case of error catch error
        return error.response.data.error[0]
    }
})
//DELETE PACKAGE AXIOS CALL USING ASYNC THUNK
export const deletePackage = createAsyncThunk("deletePackage", async (id) => {
    try {
        //Creating API call using ENDPOINTS as Base URL
        return await axios.delete(`${ENDPOINTS.DELETE_PACKAGE}/${id}`).then(res => res.data)
        
    } catch (error) {
        //In case of error catch error
        return error.response.data.error[0] 
    }
})

// now we will create slice for packages 
export const packageSlice = createSlice({
    name: "packages", //Name of Slice in Store
    initialState: {
        current: {},
        data: []
    }, //Initial State for slice
    reducers: {
        clearPackages(state){
            return {
                current: {},
                data: [],
            }
        }
    },
    extraReducers: (builder) => {
        //@Case 01: 
        //Status: Success
        //Loading: False
        //Data: Stored in State
        builder.addCase(addPackages.fulfilled, (state, action)=> {
            if(action.payload.success === true){
                //Removing unnecessary properties
                const {_id,__v, ...newItem} = action.payload.package
                //Renaming _id with id
                newItem.id = _id 
            
               //Getting previous state and add new added package
                return {...state, data: [...state.data, newItem]}
            }
            //Returning information to the front end for user Alerts
            return action.payload
        })

        // @Case 02:
        // Status: fullfilled
        builder.addCase(getPackages.fulfilled, (state, action)=> {
            //Using map iterate each item and pass into state array
            action.payload.map((item) => {
               return state.data.push({
                    id: item.id,
                    name: item.name,
                    image: `${DOMAIN}/public/packages/images/${item.image}`, 
                    features: item.features,
                    group: item.group,
                    price: item.price,
                    color: item.color,
                    status: item.status
                }) //Store fetched Packages in state of store
            }) 
        })

        // @Case 03:
        // Status: Fulfilled
        builder.addCase(deletePackage.fulfilled, (state, action)=> {
            //Check if package deleted successfully then 
            if(action.payload.success === true){
                //Show Alert of Package deleted
                // dispatch(addAlert({msg: action.payload.msg, type: "error"}))
                return {
                    ...state,
                    data: [...state.data].filter(item => item.id !== parseInt(action.payload.id))
                }
                
            }

            return action.payload
        })

        //@Case     04:
        //@Request  GET SINGLE
        //@status   Success
        //@loading  False
        //@data     Stored in State
        builder.addCase(getSinglePackage.fulfilled, (state, action) => {
        
            return {...state, current: action.payload.package}
        })
        //@Case     05:
        //@Request  GET SINGLE
        //@status   Success
        //@loading  False
        //@data     Stored in State
        builder.addCase(updatePackage.fulfilled, (state, action)=> {
            if(action.payload.success === true){
                return {...state, current: action.payload.package}
            }
            return action.payload
        }) 

        // //@Case 03: 
        // //Status: Rejected
        // //Loading: false
        // //Data: Error
        // builder.addCase(addPackages.rejected, (state, action)=> {
        //     // state.isLoading = false
        //     // state.error = action.payload
        //     console.log(action.payload)
        //     return action.payload
        // })
    }
})

export const {clearPackages} = packageSlice.actions
export default packageSlice.reducer