import {
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Grid,
    Typography
  } from "@mui/material";
  import React from "react";

const FilterForm = ({formTitle, inputs, filters, setFilter}) => {

    // This handle on change changes search filters on change 
        const handleOnChange = (e) => {
            setFilter({...filters, [e.target.name]: e.target.value})
        }

        
        //Get Input field according to type
        const getField = (input) => {
            switch (input.type) {
              case "switch":
                return (
                  <Grid item xs={input.grid.xs} sm={input.grid.sm} key={input.id}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch checked={filters[input.name]}/>}
                        disabled={input.disability}
                        name={input.name}
                        label={input.label}
                        onChange={(e)=>setFilter({...filters, [input.name]: e.target.checked})}
                      />
                    </FormGroup>
                  </Grid>
                );
              case "button":
                return (
                  <Grid item xs={input.grid.xs} sm={input.grid.sm} key={input.id}>
                    <Button type={`${input.btntype}`} color={`${input.color}`} variant={input.variant} style={{width: "100%"}}>
                      {input.label}
                    </Button>
                  </Grid>
                );
              case "select":
                return (
                  <Grid item xs={input.grid.xs} sm={input.grid.sm} md={input.grid.md} lg={input.grid.lg} key={input.id}>
                    <FormControl style={{width: "100%"}} size="small">
                      <InputLabel id="demo-simple-select-label">
                        {input.label}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        style={{ minWidth: input.minWidth, paddingTop: "-10px", width: "100%" }}
                        value={filters !== "" && filters[input.name] !== undefined?  filters[input.name] : ""}
                        label={input.label}
                        name={input.name}
                        size={input.size}
                        onChange={handleOnChange}
                      >
                      {/* Mapping up the options of select component */}
                        {input.options &&
                          input.options.map((item) => (
                            item && <MenuItem key={item.id} value={item.value}>
                              
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                );
              default:
                return
            }
          };
  return (
    <form className="form" >
          <div style={{marginBottom: "10px", marginTop: "10px"}}>
            <Typography >{formTitle}</Typography>
          </div>
        <Grid container spacing={2}>
          {inputs.map((input) => getField(input))}
        </Grid>
      </form>
  )
}

export default FilterForm