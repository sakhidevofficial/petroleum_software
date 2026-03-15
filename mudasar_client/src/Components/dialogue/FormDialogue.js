import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import GridForm from "../form/GridForm";
import { Box, IconButton, TextField } from "@mui/material";
import AvatarInput from "../form/AvatarInput";
import { Dangerous } from "@mui/icons-material";

const FormDialogue = ({
  openFormDialog, 
  heading,
  icon,
  color,
  state,
  setState,
  file,
  setFile,
  handleOnClose,
  handleOnSubmit,
  inputs,
}) => {

  

  return (
    <>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
    Open alert dialog
  </Button> */}
      <Dialog
        open={openFormDialog}
        onClose={handleOnClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEnforceFocus
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "16px",
            fontWeight: "800",
          }}
        >
          <Box style={{
            color: color,
            display: "flex",
            alignItems: "center",
            
            fontSize: "16px",
            fontWeight: "600",
          }}>
          {icon}
          {heading}
          </Box>
          <Box>
            <IconButton onClick={handleOnClose}>
              <Dangerous/>
            </IconButton>
         
          </Box>
         
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText> */}
         {/* Add New Tenant Form  */}
         {setFile && <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}
        >
          <AvatarInput file={file} setFile={setFile} />
        </div>}
         <GridForm
            title="Add New Tenant"
            inputs={inputs}
            state={state}
            setState={setState}
            file={file}
            setFile={setFile}
            submit={handleOnSubmit}
          />
        </DialogContent>
        {/* <DialogActions style={{marginRight: "18px", marginBottom: "15px"}}>
         
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default FormDialogue;
