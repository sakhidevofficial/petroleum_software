import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";

const Dialogue = ({
  openDeleteDialog,
  setConfirmInput,
  handleOnDelete,
  setOpenDeleteDialog,
  confirmInput,
  heading,
  icon,
  color,
  message,
}) => {

    //Create Handle on Delete
    const handleDelete = () => {
        handleOnDelete()
        setOpenDeleteDialog(false)
    }
  return (
    <>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
    Open alert dialog
  </Button> */}
      <Dialog
        open={openDeleteDialog}
        onClose={()=> setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            color: color,
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "800",
          }}
        >
          {icon}
          {heading}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
          {setConfirmInput  && <TextField
            label="Enter Email"
            id="outlined-size-small"
            size="small"
            type="text"
            name="confirmInput"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            style={{ width: "100%", marginTop: "20px" }}
          />}
        </DialogContent>
        <DialogActions style={{marginRight: "18px", marginBottom: "15px"}}>
          <Button variant="outlined" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dialogue;
