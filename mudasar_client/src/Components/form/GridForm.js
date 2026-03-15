import {
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormLabel,
  Box,
  Autocomplete,
} from "@mui/material";
import React from "react";
import "./form.scss";
import FileInput from "./FileInput";
import ColorPicker from "./ColorPicker";
import PasswordInput from "./PasswordInput";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CellInput from "./CellInput";
import dayjs from "dayjs";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";

export default function Form({
  formTitle,
  inputs,
  file,
  setFile,
  state,
  setState,
  submit,
}) {
  const handleNumericChange = (e) => {
    const { name, value } = e.target;

    const fieldSplit = name.split("-");

    // Regex: allow 2 decimal places for drum/reading fields, else integers only
    const regex =
      fieldSplit[1] === "quantity" ||
      name === "petrolDip" ||
      name === "dieselDip"
        ? /^\d+$/
        : /^\d*\.?\d{0,2}$/;

    if (value === "") {
      setState((prev) => ({
        ...(prev || {}),
        [name]: 0,
      }));
      return;
    }

    if (regex.test(value)) {
      setState((prev) => {
        const prevValue = prev?.[name] ?? 0;

        const cleaned = value.replace(/^0+(?!\.)/, "") || "0";

        if (prevValue === 0 || prevValue === "") {
          return {
            ...(prev || {}),
            [name]: cleaned,
          };
        }

        if (prevValue === value) return prev;

        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  //Handle on change function
  const handleOnChange = (e) => {
    setState((prev) => ({
      ...(prev || {}), // if null, treat as empty object
      [e.target.name]: e.target.value,
    }));
  };

  //Handle on Color Change
  const handleColorChange = (colorValue) => {
    setState({ ...state, color: colorValue });
  };

  //Get Input field according to type
  const getField = (input) => {
    switch (input.type) {
      case "text":
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
          >
            <TextField
              label={input.label}
              size="small"
              tabIndex={input.tabIndex}
              disabled={input.disabled}
              type={input.type}
              name={input.name}
              spellCheck={false}
              value={state !== "" ? state[input.name] : ""}
              onChange={handleOnChange}
              style={{ width: "100%" }}
            />
          </Grid>
        );
      case "number":
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
          >
            <TextField
              label={input.label}
              size="small"
              type={input.type}
              tabIndex={input.tabIndex}
              name={input.name}
              disabled={input.disabled ? true : false}
              value={
                state[input.name]
                  ? state[input.name]
                  : input.value
                  ? input.value
                  : 0
              }
              onChange={handleNumericChange}
              style={{ width: "100%" }}
            />
          </Grid>
        );
      case "switch":
        return (
          <Grid item xs={input.grid.xs} sm={input.grid.sm} key={input.id}>
            <FormControlLabel
              control={<Switch />}
              disabled={input.disability}
              name={input.name}
              tabIndex={input.tabIndex}
              label={input.label}
              onChange={(e) =>
                setState({ ...state, [input.name]: e.target.checked })
              }
            />
          </Grid>
        );
      case "button":
        return (
          <Grid item xs={input.grid.xs} sm={input.grid.sm} key={input.id}>
            {input.link ? (
              <Button
                tabIndex={input.tabIndex}
                type={`${input.btntype}`}
                color={`${input.color}`}
                variant={input.variant}
                component={Link}
                to={input.link}
                style={{ width: "100%" }}
              >
                {input.label}
              </Button>
            ) : input.btnFunc ? (
              <Button
                tabIndex={input.tabIndex}
                type="button"
                color={`${input.color}`}
                variant={input.variant}
                onClick={() => input.btnFunc()}
                style={{ width: "100%" }}
              >
                {input.label}
              </Button>
            ) : (
              <Button
                tabIndex={input.tabIndex}
                type={`${input.btntype}`}
                color={`${input.color}`}
                variant={input.variant}
                style={{ width: "100%" }}
              >
                {input.label}
              </Button>
            )}
          </Grid>
        );
      case "select": {
        const selectOptions = Array.isArray(input?.options) ? input.options : [];
        const currentValue = state?.[input.name];
        const selectedOption = selectOptions.find(
          (item) =>
            item.value === currentValue ||
            item.id === currentValue ||
            (typeof currentValue === "string" &&
              String(item.name || "").toLowerCase().trim() === String(currentValue).toLowerCase().trim())
        );
        const valueDisplay = selectedOption ?? (currentValue != null && currentValue !== ""
          ? { value: currentValue, name: String(currentValue) }
          : null);
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
          >
            <FormControl style={{ width: "100%" }} size="small">
              <Autocomplete
                options={selectOptions}
                size={input.size || "small"}
                disableClearable
                disabled={input.disabled}
                freeSolo={false}
                isOptionEqualToValue={(option, value) => {
                  if (!value) return false;
                  const v = value?.value ?? value;
                  const oVal = option?.value ?? option?.id;
                  if (oVal !== undefined && v !== undefined) return oVal === v || Number(oVal) === Number(v);
                  return (option?.name ?? "") === (value?.name ?? String(value));
                }}
                getOptionLabel={(option) => (option && typeof option === "object" ? option.name : "") || ""}
                value={valueDisplay}
                onInputChange={(event, typedValue) => {
                  if (event?.type === "change" && typedValue !== undefined && typedValue !== null) {
                    handleOnChange({
                      target: { name: input.name, value: typedValue },
                    });
                  }
                }}
                onChange={(event, newValue) => {
                  if (newValue && typeof newValue === "object") {
                    const id = newValue.value ?? newValue.id;
                    handleOnChange({
                      target: { name: input.name, value: id !== undefined ? id : newValue.name },
                    });
                  } else {
                    handleOnChange({
                      target: { name: input.name, value: newValue != null ? newValue : "" },
                    });
                  }
                }}
                renderInput={(params) => {
                  const selectedItem = selectedOption;
                  const salaryDisplay =
                    selectedItem?.salary != null && selectedItem.salary !== ""
                      ? typeof selectedItem.salary === "number"
                        ? selectedItem.salary.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                          })
                        : String(selectedItem.salary)
                      : "";
                  const helperText = selectedItem?.designation
                    ? `Salary: ${salaryDisplay}`
                    : salaryDisplay
                    ? `Remaining Amount: ${salaryDisplay}`
                    : "";

                  return (
                    <TextField
                      {...params}
                      label={input.label}
                      helperText={helperText}
                    />
                  );
                }}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      gap: 2,
                    }}
                  >
                    {/* Left */}
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      {option.avatarUrl && (
                        <Avatar
                          src={option.avatarUrl}
                          size={40}
                          round={true}
                          style={{ marginRight: 10 }}
                        />
                      )}
                      {option.name}
                    </Box>

                    {/* Center */}
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      {option.amount ? (
                        <>
                          <Box>
                            {option.amount.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                            })}
                          </Box>
                          <Box>
                            {option.remAdv.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                            })}
                          </Box>
                        </>
                      ) : option.salary ? (
                        <Box>
                          {option.salary.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                          })}
                        </Box>
                      ) : null}
                    </Box>

                    {/* Right */}
                    {(option.designation || option.date) && (
                      <Box sx={{ textAlign: "right", flex: 1 }}>
                        {option.designation
                          ? `( ${option.designation} )`
                          : option.date
                          ? `( ${option.date} )`
                          : null}
                      </Box>
                    )}
                  </Box>
                )}
              />
            </FormControl>
          </Grid>
        );
      }
      case "colorInput":
        return (
          <Grid item xs={input.grid.xs} sm={input.grid.sm} key={input.id}>
            <ColorPicker
              value={state.color}
              handleColorChange={handleColorChange}
            />
          </Grid>
        );
      case "file":
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
          >
            <FileInput file={file} setFile={setFile} />
          </Grid>
        );
      case "email":
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
          >
            <TextField
              label={input.label}
              size="small"
              tabIndex={input.tabIndex}
              style={{ minWidth: "100%" }}
              spellCheck={false}
              onChange={handleOnChange}
              name={input.name}
              value={state[input.name]}
            />
          </Grid>
        );
      case "password":
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
          >
            <PasswordInput
              label={input.label}
              onChange={handleOnChange}
              name={input.name}
              type={input.type}
              state={state}
            />
          </Grid>
        );
      case "phone":
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
          >
            <CellInput state={state} name={input.name} setState={setState} />
          </Grid>
        );
      case "date":
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={input.label}
                name={input.name}
                format="DD-MM-YYYY"
                tabIndex={input.tabIndex}
                disabled={input.disabled}
                maxDate={dayjs()}
                value={
                  state[input.name] !== ""
                    ? dayjs(state[input.name], "DD-MM-YYYY")
                    : null
                }
                slotProps={{
                  textField: { size: "small", fullWidth: true, error: false },
                }}
                onChange={(value) =>
                  setState({
                    ...state,
                    [input.name]: dayjs(value.$d).format("DD-MM-YYYY"),
                  })
                }
              />
            </LocalizationProvider>
          </Grid>
        );
      case "month":
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={input.label}
                views={["month"]}
                name={input.name}
                value={
                  state[input.name] !== ""
                    ? dayjs(state[input.name], "MMM")
                    : ""
                }
                slotProps={{
                  textField: { size: "small", fullWidth: true, error: false },
                }}
                onChange={(value) => {
                  const formattedValue = value ? value.format("MMM") : null;
                  setState({
                    ...state,
                    [input.name]: formattedValue,
                  });
                }}
                format="MMM"
              />
            </LocalizationProvider>
          </Grid>
        );
      case "radio":
        return (
          <Grid item xs={input.grid.xs} sm={input.grid.sm} key={input.id}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                {input.label}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name={input.name}
              >
                {(Array.isArray(input?.options) ? input.options : []).map(
                  (item) =>
                    item && (
                      <FormControlLabel
                        key={item.id}
                        value={item.value}
                        control={<Radio />}
                        label={item.name}
                      />
                    )
                )}
              </RadioGroup>
            </FormControl>
          </Grid>
        );
      case "label":
        return (
          <Grid
            item
            xs={input.grid.xs}
            sm={input.grid.sm}
            md={input.grid.md}
            lg={input.grid.lg}
            key={input.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle1">{input.label}</Typography>
          </Grid>
        );
      default:
        return;
    }
  };
  return (
    <form className="form" onSubmit={submit}>
      <div style={{ marginBottom: "10px", marginTop: "10px" }}>
        <Typography>{formTitle}</Typography>
      </div>

      <Grid container spacing={2}>
        {inputs.map((input) => getField(input))}
      </Grid>
    </form>
  );
}
