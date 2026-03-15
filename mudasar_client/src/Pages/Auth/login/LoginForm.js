import React, { useState, useContext } from "react";
import { TextField, Link, Button } from "@mui/material";
import AuthContext from "../../../context/auth/AuthContext";
import  setAlert  from "../../../redux/alertSlice/setAlert";
import "./login.scss";
import { toast } from "react-toastify";

const LoginForm = () => {
  //Call Auth context & Extract login
  const { login } = useContext(AuthContext);

  //State for Text Field values
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  //Extract values from state
  const { username, password } = values;

  //Handle changing values on key enter
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  //Submit to API request
  const onSubmit = (e) => {
    e.preventDefault();
    if (username === "") {
      toast("Please enter username!", {position: "top-right", type: "error"});
    } else if (password === "") {
      toast("Please enter password!", {position: "top-right", type: "error"});
    } else {
      login(values);
    }
  };


  return (
    <form className="loginForm" onSubmit={onSubmit}>
      <TextField
        variant="outlined"
        margin="normal"
        className="textField"
        spellCheck={false}
        fullWidth
        id="email"
        label="Username"
        name="username"
        autoComplete="email"
        autoFocus
        onChange={onChange}
        value={username}
      />

      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        className="textField"
        autoComplete="current-password"
        onChange={onChange}
        value={password}
      />
      <div
        className="forgotPassword"
        style={{ display: "flex", flexDirection: "row-reverse" }}
      >
        {/* <Link href="#" onClick={preventDefault}>
          Forget Password
        </Link> */}
      </div>
      <Button type="submit" fullWidth variant="contained" className="loginBtn">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
