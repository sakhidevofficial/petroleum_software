import "./app.scss";
import React, { useContext, useEffect } from "react";
import { LinearProgress } from "@mui/material";
import AuthContext from "./context/auth/AuthContext";
import "./app.scss";
import ModeContext from "./context/mode/ModeContext";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
// import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

const AuthApp = React.lazy(() => import("./routes/authapp/AuthApp"));
const UnauthApp = React.lazy(() => import("./routes/unauthapp/UnAuthApp"));

function App() {
  //Call Auth context & Extract loading & isAuthenticated
  const { loading, isAuthenticated } = useContext(AuthContext);

  //Initializing the use Context to get DarkMode state
  const { darkMode, dispatch } = useContext(ModeContext);

  //Get User Default Mode & Change Mode
  // const OSMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
 
  const darkTheme = createTheme(themeSettings(darkMode));
  // useEffect(() => {
  //   OSMode ? dispatch({ type: "DARK" }) : dispatch({ type: "LIGHT" });
  //   //eslint-disable-next-line
  // }, [OSMode]);

  // let loading = false;
  if (loading) return <LinearProgress className="progress" />;
  return (
    <React.Suspense fallback={<LinearProgress className="progress" />}>
       <ThemeProvider theme={darkTheme}>
          <CssBaseline />
            {isAuthenticated ? (
              <AuthApp mode={darkMode} />
            ) : (
              <UnauthApp mode={darkMode} />
            )}
       </ThemeProvider>
        
    </React.Suspense>
  );
}

export default App;
