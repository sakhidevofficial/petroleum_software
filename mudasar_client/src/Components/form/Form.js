import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Grid
} from "@mui/material";
import React, { useEffect } from "react";
import "./form.scss";

export default function Form({ inputs, state, setState, submit, submitBtn }) {
 

  //Handle on change function
  const handleOnChange = (e) => {
    setState({...state, [e.target.name]: e.target.value });
  };

  //HERE IS ISSUE TO BE RESOLVE
  useEffect(() => {
    let sItem = {};
    inputs.forEach((item) => {
      sItem[item.name] = "";
    });
    setState(sItem);
  }, [inputs, setState]);

 
  //Get Input field according to type
  const getField = (input) => {
    switch (input.type) {
      case "text":
        return (
          <Grid item xs={input.grid.xs} sm={input.grid.sm} md={input.grid.md} lg={input.grid.lg} key={input.id}>
            <TextField
              label={input.label}
              id="outlined-size-small"
              size="small"
              style={{minWidth: "100%"}}
              onChange={handleOnChange}
              name={input.name}
              value={state[input.name]}
            />
          </Grid>
        );
        case "number":
          return (
            <Grid item xs={input.grid.xs} sm={input.grid.sm} md={input.grid.md} lg={input.grid.lg} key={input.id}>
              <TextField
                label={input.label}
                id="outlined-size-small"
                size="small"
                style={{minWidth: "100%"}}
                onChange={handleOnChange}
                name={input.name}
                value={state[input.name]}
              />
            </Grid>
          );
      case "switch":
        return (
          <Grid item xs={input.grid.xs} sm={input.grid.sm} md={input.grid.md} lg={input.grid.lg} key={input.id}>
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked />}
                disabled={false}
                name={input.name}
                onChange={handleOnChange}
                label={input.label}
              />
            </FormGroup>
          </Grid>
        );
      case "select":
        return (
          <Grid item xs={input.grid.xs} sm={input.grid.sm} md={input.grid.md} lg={input.grid.lg} key={input.id}>
            <FormControl style={{minWidth: "100%"}} size="small">
              <InputLabel id="demo-simple-select-label">
                {input.label}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ minWidth: input.minWidth, paddingTop: "-10px" }}
                value={state !== "" ? state[input.name] : ""}
                label={input.label}
                name={input.name}
                size={input.size}
                onChange={handleOnChange}
              >
                {/* Mapping up the options of select component */}
                {input.options &&
                  input.options.map((item) => (
                    <MenuItem key={item.id} value={item.value}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        );
      default:
        return (
          <div className="formInput" key={input.id}>
            <TextField
              label={input.label}
              id="outlined-size-small"
              size="small"
            />
          </div>
        );
    }
  };
  return (
    // <Box className="form">
      <form onSubmit={submit} style={{ display: "flex", paddingLeft: "20px", paddingRight: "20px"}}>
        <Grid container spacing={2}>
          {inputs.map((input) => getField(input))}
        </Grid>
      </form>
    // </Box>
  );
}
