import React, {

  useContext,
  //  useEffect
} from "react";
import { TextField, Grid, Button } from "@mui/material";
import "./signup.scss";
import AuthContext from "../../../context/auth/AuthContext";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import * as yup from "yup";
import { toast } from "react-toastify";

//This is a makeStyles function used for making custom styles
//in this use Style "form" object is used to styling form JSX element
// Submit object is used to styling the submit button in the form

const SignupForm = ({ state, setState }) => {
  //Initialization of Auth Context and Alert Context
  const { register } = useContext(AuthContext);

  //Destructing of textfield values from state used with the name of values
  const { name, username, email, companyName, access, address, password, confirmPassword } = state;

  //On change function will execute on changing the value in Text Field
  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  //On Submit function first checks that all fields must not be empty
  //password and confirm password must match
  //the it passes values to the register function

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Passwords don't match", {position: "top-right", type: "error"});
    } else if(email === "") {
      toast("Please enter valid email", {position: "top-right", type: "error"})
    } else {
      const newState = {...state}
      register(newState)
    }
  };

  return (
    //Starting of form which includes all Text fields
    //The contents of form (TextFields, submit button) are wrapped in Grid System to make application responsive with mobile devices.

    <form className="signupForm" onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/*Text Field for the first name of user*/}
          <TextField
            name="name"
            variant="outlined"
            required
            fullWidth
            id="Name"
            size="small"
            label="Full Name"
            autoFocus
            onChange={onChange}
            value={name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/*Text Field for the Last name of user*/}
          <TextField
            variant="outlined"
            required
            fullWidth
            id="Username"
            size="small"
            label=" Username"
            name="username"
            autoComplete="lname"
            onChange={onChange}
            value={username}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/*Text Field for the Email of user*/}
          <TextField
            variant="outlined"
            required
            fullWidth
            id="Email"
            label="Email"
            name="email"
            size="small"
            autoComplete="email"
            onChange={onChange}
            value={email}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/*Text Field for the Contact of Tenant*/}
          <PhoneInput
            name="Contact Number"
            country={'pk'}
            masks={{pk: '...-.......'}}
            placeholder="+92 300-1234567"
            value={state.phone}
            onChange={contact => setState({...state, contact })}
          />
         
        </Grid>
        <Grid item xs={12}>
          {/* Text Field for the Tenant or Organization Name  */}
           <TextField
            variant="outlined"
            required
            fullWidth
            id="Tenant Name"
            label="Tenant / Organization Name"
            name="companyName"
            size="small"
            onChange={onChange}
            value={companyName}
          />
        </Grid>
        <Grid item xs={12}>
          {/* Text Field for the Address  */}
           <TextField
            variant="outlined"
            required
            fullWidth
            id="Address"
            label="Address"
            name="address"
            size="small"
            onChange={onChange}
            value={address}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/*Text Field for the password of user*/}
          <TextField
            variant="outlined" // Variant defines style of Text Field
            required // Required means must not be empty
            fullWidth // Must Contain full width of parent element
            name="password" // Name of Text Field
            label="Password" // Label or Name respresents text field
            type="password" // Type of value which will be entered
            id="Password" // Id or identification used for text field
            autoComplete="current-password"
            size="small"
            onChange={onChange} //OnChange will execute func on changing value
            value={password}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/*Text Field for the Confirm Password of user*/}
          <TextField
            variant="outlined"
            fullWidth
            required
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="ConfirmPassword"
            size="small"
            autoComplete="current-password"
            onChange={onChange}
            value={confirmPassword}
          />
        </Grid>
      </Grid>

      {/* This is submit button which will execute onSubmit function on click */}
      <Button type="submit" fullWidth variant="contained" className="primary" style={{marginTop: 20}}>
        Sign Up
      </Button>
    </form>
  );
};
export default SignupForm;
