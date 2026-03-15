import { useReducer } from "react";
import { v4 as uuid } from "uuid";
import { REMOVE_ALERT, SET_ALERT } from "../types";
import AlertContext from "./AlertContext";
import AlertReducer from "./AlertReducer";

//Creating Alert Provider Function
const AlertProvider = ({ children }) => {
  //Creating the initial state for Alert Provider
  const initialState = [];
  //Calling the reducer function and pass initial state
  const [state, dispatch] = useReducer(AlertReducer, initialState);

  //CREATING SET ALERT METHOD
  const setAlert = (msg, type, timeout = 5000) => {
    //Generating id for each individual alert
    const id = uuid; 
    //Calling dispatch function to pass data to reducer
    dispatch({ type: SET_ALERT, payload: { id, msg, type } });
    //Calling the set Timeout to remove alert
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  //Returning the setAlert Method from Alert Provider
  return (
    <AlertContext.Provider value={{ alerts: state, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
