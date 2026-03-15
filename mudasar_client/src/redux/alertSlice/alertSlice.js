import {createSlice} from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import {store} from "../store"

//Creating Alert Slice to Set Alerts
export const alertSlice = createSlice({
    name: "alerts",
    initialState: [],
    reducers: {
        addAlert: (state, action) => {
            //Generating id for each individual alert
            const id = uuid();
           if(id !== ""){
               const errMsg = {id: id, msg: action.payload.msg, type: action.payload.type}
               //Set state
               state.push(errMsg)
            }
           
            
             //Calling the set Timeout to remove alert
            setTimeout(() => {
                store.dispatch(removeAlert({id}))
            }, 4000);
        },
        removeAlert: (state, action) => {
            return state.filter(item => item.id !== parseInt(action.payload.id))
        }
    }
})

export const {addAlert, removeAlert} = alertSlice.actions
export default alertSlice.reducer