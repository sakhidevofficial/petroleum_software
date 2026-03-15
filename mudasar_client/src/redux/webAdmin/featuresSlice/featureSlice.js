import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
import { ENDPOINTS } from "../../../backend/API"

//ADD NEW FEATURE AXIOS CALL USING ASYNC THUNK
export const addFeature = createAsyncThunk("addFeature", async (Data) => {
    try {
        //Creating API call using ENDPOINTS as Base URL ("/api/features")
        return await axios.post(ENDPOINTS.ADD_FEATURE, Data).then(res => res.data)
    } catch (error) {
        //In case of error catch error 
        return error.response.data.error[0]
    }
})
//GET ALL FEATURES AXIOS CALL USING ASYNC THUNK
export const getFeatures = createAsyncThunk("getFeatures", async() => {
    try {
        //Creating API Call using Base URL ("/api/features")
        return await axios.get(ENDPOINTS.GET_FEATURES).then(res => res.data)
    } catch (error) {
        //In case of error catch error from errors array
        return error.response.data.error[0]
    }
})
//DELETE FEATURE AXIOS CALL USING ASYNC THUNK
export const deleteFeature = createAsyncThunk("deleteFeature", async (id) => {
    try {
        //Creating API call using Base URL ("/api/features")
        return await axios.delete(`${ENDPOINTS.DELETE_FEATURE}/${id}`).then(res => res.data)
    } catch (error) {
        //In case of error catch error from errors array 
        return error.response.data.error[0]
    }
})
//Create features slice and export it
export const featureSlice = createSlice({
    name: "features",
    initialState: [],
    reducers: {
        clearFeatures(state){
            return []
        }
    },
    extraReducers: (builder) => {
        //@Case     01:
        //@Request  POST
        //@status   Success
        //@loading  False
        //@data     Stored in state
        builder.addCase(addFeature.fulfilled, (state, action) => {
            if(action.payload.success === true){
                const feature = {
                    id: action.payload.feature.id,
                    feature: action.payload.feature.name,
                    description: action.payload.feature.description,
                    status: action.payload.feature.status
                }
                return [...state, feature]
            }
            return action.payload
        })

        //@Case     02:
        //@Request  GET
        //@status   Success
        //@loading  False
        //@data     Stored in State
        builder.addCase(getFeatures.fulfilled, (state, action) => {
            //using map function iterate each item and pass into state array
            action.payload.map(item => {
                // state.push(item)
              return state.push({
                    id: item.id,
                    feature: item.name,
                    description: item.description,
                    status: item.status
                }) //Storing fecthed features in the state of store
            })
        })

        //@Case No  03:
        //@Request  DELETE
        //@Status   Success
        //@Loading  False
        //@data     Stored in state filtered data except deleted one
        builder.addCase(deleteFeature.fulfilled, (state, action)=> {
        
            //Check if feature deleted successfully then filter state
            if(action.payload.success === true){
                return state.filter(item => item.id !== parseInt(action.payload.id))
            }
            //Return action payload to frontend delete function
            return action.payload
        })


    }
})

export const {clearFeatures} = featureSlice.actions
export default featureSlice.reducer