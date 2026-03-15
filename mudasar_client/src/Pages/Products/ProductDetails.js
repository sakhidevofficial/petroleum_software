import * as React from "react";

import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";

import {
  Box,
  Grid,
  IconButton,
  Paper,
  styled,
  Typography,
} from "@mui/material";

import { Dangerous } from "@mui/icons-material";

import Avatar from "react-avatar";
import { useContext } from "react";
import ModeContext from "../../context/mode/ModeContext";
import { DOMAIN } from "../../backend/API";

const ProductDetails = ({
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
  //Initializing the use Context to get DarkMode state
  const { darkMode, dispatch } = useContext(ModeContext);

  const DemoPaper = styled(Paper)(({ theme }) => ({
    width: "100%",
    // height: 120,
    padding: theme.spacing(2),
    ...theme.typography.body2,
  }));

  const capitalizeEachWord = (str) => {
    // Use a regular expression to find word boundaries where a lowercase letter is followed by an uppercase letter
    let result = str.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Split the string by space and capitalize the first letter of each word
    result = result
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return result;
  };

  const renderValue = (key, value, i) => {
    if (key === "prices" && value !== null) {
      // Render nested objects with a recursive call
      return (
        <Grid item xs={12} key={i}>
          <Typography variant="h6" style={{ marginBottom: 5 }}>
            {capitalizeEachWord(String(key))}
          </Typography>
          <Grid container spacing={2} style={{ paddingLeft: 20 }}>
            {console.log(value)}
            {value.map((item, nestedIndex) =>
              Object.entries(item).map(
                ([nestedKey, nestedValue], nestedIndex) => {
                  if (
                    nestedKey !== "_id" &&
                    nestedKey !== "productId" &&
                    nestedKey !== "purchaseId" &&
                    nestedKey !== "createdOn" &&
                    nestedKey !== "__v" &&
                    nestedKey !== "date"
                  ) {
                    return (
                      <Grid item xs={12} sm={6} md={6} lg={6} key={nestedKey}>
                        {console.log("Checking the key ", nestedKey)}
                        {nestedKey === "newSellingPrice" ||
                        nestedKey === "costPrice" ||
                        nestedKey === "oldSellingPrice" ||
                        nestedKey === "priceDifference" ||
                        nestedKey === "differenceValue" ? (
                          <Typography>
                            {capitalizeEachWord(String(nestedKey))} :{" "}
                            <span style={{color: "#2a4ea1", fontWeight: "bold"}}>
                              {parseFloat(nestedValue)?.toLocaleString(
                                "en-US",
                                {
                                  style: "currency",
                                  currency: "PKR",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              ) || 0}{" "}
                            </span>
                          </Typography>
                        ) : (
                          <Typography>
                            {capitalizeEachWord(String(nestedKey))} :{" "}
                            {capitalizeEachWord(String(nestedValue))}{" "}
                          </Typography>
                        )}
                      </Grid>
                    );
                  }
                }
              )
            )}
          </Grid>
        </Grid>
      );
    } else if (
      typeof value !== "object" &&
      key !== "_id" &&
      key !== "createdOn" &&
      key !== "pic"
    ) {
      // Render simple values and handle "credit" and "cash" styling
      return (
        <Grid item xs={12} sm={6} md={6} lg={6} key={i}>
          <Box style={{ display: "flex", gap: 10 }}>
            <Typography>{capitalizeEachWord(String(key))}</Typography>
            {value === "active" || value === "deactive" ? (
              <div
                style={{
                  background: value === "active" ? "#64c72e" : "#94928e",
                  color: "white",
                  width: 55,
                  textAlign: "center",
                  borderRadius: 4,
                }}
              >
                {capitalizeEachWord(String(value))}
              </div>
            ) : (
              <Typography>{capitalizeEachWord(String(value))}</Typography>
            )}
          </Box>
        </Grid>
      );
    }
    return null;
  };

  return (
    <>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
    Open alert dialog
  </Button> */}
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
          {/* <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText> */}
          {/* Add New Tenant Form  */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            <Avatar
              src={
                inputs.pic
                  ? `${DOMAIN}/public/products/images/${inputs.pic}`
                  : "./img/avatarfile.png"
              }
              size={120}
              round={true}
            />
          </div>
          <Grid container spacing={2}>
            {Object.entries(inputs).map(([key, value], i) =>
              renderValue(key, value, i)
            )}
          </Grid>
          {/* <div style={{ marginTop: 10, }}>
                        {Object.entries(inputs).map(([key, value], i) => {
                            if (Array.isArray(value)) {
                                return value.map((item, index) => (
                                    <DemoPaper key={`${key}-${index}`} style={{marginTop: 7, color: darkMode === "dark" ? "#999" : "#222"
                                    }} >
                                        <Box style={{ display: "flex", justifyContent: "space-around" }}>
                                            <Box>
                                                <Box>Quantity: {item.quantity}</Box>
                                                <Box>Selling Price: {item.price.newSellingPrice}</Box>

                                            </Box>
                                            <Box>{item.product.name}</Box>
                                            <Box>
                                                <Box>Total Amount: {item.quantity * item.price.newSellingPrice}</Box>
                                                <Box>Discount Amount: {item.price.newSellingPrice / 100 * item.discount}</Box>
                                            </Box>
                                        </Box>
                                    </DemoPaper>
                                ));
                            }
                            return null; // or handle non-array values if needed
                        })}
                    </div> */}
        </DialogContent>
        {/* <DialogActions style={{marginRight: "18px", marginBottom: "15px"}}>
         
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default ProductDetails;
