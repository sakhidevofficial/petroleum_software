//Create Reducer & Export
const DarkModeReducer = (state, action) => {
  //Handle actions when mode is light, dark & toggle
  switch (action.type) {
    case "LIGHT":
      return {
        darkMode: "light",
      };
    case "DARK":
      return {
        darkMode: "dark",
      };
    case "TOGGLE":
      return {
        darkMode: state.darkMode === "light" ? "dark" : "light",
      };
    default:
      return state;
  }
};

export default DarkModeReducer;
