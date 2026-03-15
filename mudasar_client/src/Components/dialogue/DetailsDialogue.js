import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton } from "@mui/material";
import { Dangerous } from "@mui/icons-material";
import DetailsPaper from "../form/DetailsPaper";
import Avatar from "react-avatar";
import { DOMAIN } from "../../backend/API";

const DetailsDialog = ({
  openDetailsDialog,
  handleOnDelete,
  setOpenDetailsDialog,
  heading,
  icon,
  color,
  state,
  setState,
  file,
  setFile,
  Id,
  handleOnCloseDetails,
  handleOnSubmit,
  inputs,
  message,
}) => {
  return (
    <>
      <Dialog
        open={openDetailsDialog}
        onClose={handleOnCloseDetails}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
          <Box
            style={{
              color: color,
              display: "flex",
              alignItems: "center",

              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {icon}
            {heading}
          </Box>
          <Box>
            <IconButton onClick={handleOnCloseDetails}>
              <Dangerous />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            {inputs && (
              <Avatar
                src={
                  inputs.pic
                    ? `${DOMAIN}/public/${
                        inputs.designation
                          ? "employees"
                          : inputs.companyName
                          ? "suppliers"
                          : inputs.newSellingPrice ? "products" : inputs.username ? "users": "customers"
                      }/images/${inputs.pic}`
                    : "./img/avatarfile.png"
                }
                size={120}
                round={true}
              />
            )}
          </div>
          <DetailsPaper inputs={inputs} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DetailsDialog;
