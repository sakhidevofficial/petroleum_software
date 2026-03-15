import * as React from "react";

import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";

import { Box, IconButton, Paper, styled, Typography } from "@mui/material";

import { Dangerous } from "@mui/icons-material";
import GridForm from "../../Components/form/GridForm";
import { useContext } from "react";
import ModeContext from "../../context/mode/ModeContext";

const ShiftDialog = ({
    openDetailsDialog,
    handleOnDelete,
    setOpenDetailsDialog,
    heading,
    icon,
    color,
    state,
    setState,
    data,
    products,
    selectedCustomerId,
    Id,
    customerId,
    handleOnCloseDetails,
    handleOnSubmit,
    inputs,
    message,
}) => {

    //Initializing the use Context to get DarkMode state
    const { darkMode} = useContext(ModeContext);

    const DemoPaper = styled(Paper)(({ theme }) => ({
        width: "100%",
        // height: 120,
        padding: theme.spacing(2),
        ...theme.typography.body2,
    }));

    const capitalizeEachWord = (str) => {
        // Ensure the input is a string
        if (typeof str !== 'string') {
            return '';
        }

        // Step 1: Split the PascalCase string into individual words based on transitions between lowercase and uppercase
        const words = str.match(/([A-Z][a-z]+|[a-z]+)/g);

        // Step 2: Handle cases where no matches are found (words is null)
        if (!words) {
            return str; // If no matches, return the original string
        }

        // Step 3: Capitalize the first letter of all words
        const capitalizedWords = words.map((word, index) => {
            // Capitalize the first word, but leave others as lowercase
            return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase();
        });

        // Step 4: Join the words back into a single string with spaces between them
        return capitalizedWords.join(' ');
    }

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
                PaperProps={{
                    style: {
                        width: '800px', // Adjust this
                        maxWidth: 'unset' // Prevent default maxWidth cap
                    }
                }}
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
                        <IconButton onClick={handleOnCloseDetails}>
                            <Dangerous />
                        </IconButton>

                    </Box>

                </DialogTitle>
                <DialogContent >
         
                    <GridForm
                        title="Add New Tenant"
                        inputs={inputs}
                        state={state}
                        setState={setState}
                    />
                    <div style={{ marginTop: 10, height: 200, overflow: "auto" }}>
                        {(() => {
                            const customer = data.find(c => c.customerId === state.customerId);


                            if (!customer || !Array.isArray(customer.products) || customer.products.length === 0) {
                                return <Box>No products found for this customer.</Box>;
                            }

                            return customer.products.map((product, index) => (
                                <DemoPaper
                                    key={`product-${index}`}
                                    style={{
                                        marginTop: 7,
                                        color: darkMode === "dark" ? "#999" : "#222",
                                    }}
                                >
                                    <Box style={{display: "flex", justifyContent: "space-between", alignItems: "center"}} >
                                        <Box style={{ textAlign: "left", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>{capitalizeEachWord(products.find(c => c._id === product.productId)?.name)}</Box>
                                        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold"}}>
                                            {(parseFloat(product.amount) / products.find(c => c._id === product.productId)?.price?.newSellingPrice)?.toFixed(2)}

                                        </Box>
                                        <Box lg={4} style={{display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold"}}>
                                            <Box>{parseFloat(product.amount).toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'PKR',
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                            </Box>
                                        </Box>

                                    </Box>
                                    <Typography style={{ textAlign: "center" }}>{product.description}</Typography>
                                </DemoPaper>
                            ));

                        })()}
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", fontWeight: "bold" }}>
                        {(() => {
                            const customer = data.find(c => c.customerId === state.customerId);

                            if (customer && Array.isArray(customer.products)) {
                                const total = customer.products.reduce((sum, p) => parseFloat(sum) + parseFloat(p.amount), 0);
                                return `Total: ${total.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'PKR',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}`;
                            }

                            return "Total: 0";
                        })()}
                    </div>
                </DialogContent>
                {/* <DialogActions style={{marginRight: "18px", marginBottom: "15px"}}>
         
        </DialogActions> */}
            </Dialog>
        </>
    );
};

export default ShiftDialog;
