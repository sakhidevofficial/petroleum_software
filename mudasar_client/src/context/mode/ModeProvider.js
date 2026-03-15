import { useReducer } from "react";
import ModeContext from "./ModeContext";
import ModeReducer from "./ModeReducer";

//Create Mode Context Provider
const ModeProvider = ({ children }) => {
  //Initial State for context
  const initialState = {
    darkMode: "light",
  };

  //Call Reducer to use dispatch & handle state
  const [state, dispatch] = useReducer(ModeReducer, initialState);

  //Return context provider
  return (
    <ModeContext.Provider value={{ darkMode: state.darkMode, dispatch }}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeProvider;
