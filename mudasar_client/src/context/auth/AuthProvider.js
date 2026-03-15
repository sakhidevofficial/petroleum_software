import axios from "axios";
import {useEffect, useReducer } from "react";
import { ENDPOINTS } from "../../backend/API";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import { setAuthToken } from "../../backend/setAuthToken";
import LocalStorage from "../../helpers/LocalStorage";
import { LOGIN_SUCCESS, LOGOUT } from "../types";
import { toast } from "react-toastify";



const AuthProvider = ({ children }) => {
  //Creating the initial state for the context
  const initialState = {
    isAuthenticated: null,
    loading: false,
    user: null,
  };

  //Check if User Logged In
  useEffect(() => {
    const init = async () => {
      //Check if Token Exist then setAuthToken
      const token = LocalStorage.getToken();

      if (token) {
        setAuthToken(token);
        await getUser();
      }
    };

    init();
    //eslint-disable-next-line
  }, []);
  //Calling the use Reducer to perform actions
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  //CREATING REGISTER USER METHOD
  const register = async (formData) => {
    //Start try catch to handle exceptions
    try {
      console.log(formData)
      //Calling Api request
      const res = await axios.post(ENDPOINTS.REGISTER, formData);
      console.log(res.data)
      if (res.data.success === true) {
        toast(res.data.msg, {position: "top-right", type: "success"})
      }
    } catch (error) {
      console.log(error)
      if(error.response.data.errors){

        for(let i=0; i < error.response.data.errors.length; i++){
          toast(error.response.data.errors[i].msg, {position: "top-right", type: "error"})
        }
      }
     
    }
  };

  //LOGIN USER METHOD
  const login = async (formData) => {
    try {
      const res = await axios.post(ENDPOINTS.LOGIN, formData);
      if (res.data.token) {
        //set token to set Auth token and local storage
        setAuthToken(res.data.token);
        LocalStorage.setToken(res.data.token);
        await getUser();
      }
    } catch (error) {  
      console.log(error.response.data)  
      if(error.response.data.errors){

        for(let i=0; i < error.response.data.errors.length; i++){
          toast(error.response.data.errors[i].msg, {position: "top-right", type: "error"})
        }
      }
    }
  };

  //GET USER METHOD
  const getUser = async () => {
    try {
      const res = await axios.get(ENDPOINTS.GET_USER);
      dispatch({ type: LOGIN_SUCCESS, payload: { user: res.data } });
    } catch (error) {
      if(error.response.data.errors){

        for(let i=0; i < error.response.data.errors.length; i++){
          toast(error.response.data.errors[i].msg, {position: "top-right", type: "error"})
        }
      }
    }
  };

  //LOGOUT METHOD
  const logout = () => {
   
    LocalStorage.clear();
    dispatch({ type: LOGOUT });
   
  };
  //Returning functions and values to Provider
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
