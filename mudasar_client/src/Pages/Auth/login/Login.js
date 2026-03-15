
import { Box, Container, Typography } from "@mui/material";
import React, {useContext} from "react";
import Alert from "../../../Components/alert/Alert";
import Navbar from "../../../Components/navbar/Navbar";
import ModeContext from "../../../context/mode/ModeContext";
import "./login.scss";
import LoginForm from "./LoginForm";


const Login = () => {
    //Initializing the use Context to get DarkMode state
    const { darkMode } = useContext(ModeContext);
  return (
    <div className="login">
      <Navbar />
      <Alert />
      <Container className="loginContainer" component="main" maxWidth="xs">
        {/* Company Logo */}
          <img src={`${darkMode === "dark"? "./img/logo1.png": "./img/logo1.png" }`} style={{width: "100px", height: "100px"}} alt="logo" />
    
        <LoginForm />
        <Box mt={8}>
          <Typography
            className="copyrightText"
            variant="body2"
            color="textSecondary"
            align="center"
          >
            Copyright © Saimon Technologies {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
