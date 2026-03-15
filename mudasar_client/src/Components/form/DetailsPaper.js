import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

const DetailsPaper = ({ inputs }) => {
  //Capitalize function 
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

    <Grid container spacing={2}>
      {
        Object.entries(inputs).map(([key, value], i) => {
          return (
            key !== "_id" && key !== "pic" && key !== "userId" && key !== "customerId" && key !== "supplierId" && key !== "priceId" && key !== "productId" && key !== "createdOn" && key !== "customerName" && key !== "name" &&  key !== "employeeId" && key !== "employeeName" && key !== "password" && <Grid item xs={12} sm={6} md={6} lg={6} key={i}>
              <Box style={{ display: "flex", gap: 10 }} >

                <Typography>{capitalizeEachWord(key)}</Typography> :
                {value === "active" || value === "deactive" || value === "open" || value === "locked"? <div style={{ background: value === "active" || value === "open" ? "#02bf2e" : "#777", color: "white", width: 70, textAlign: "center", borderRadius: 4 }}>
                {capitalizeEachWord(String(value))}
                </div> : key === "salary" ?<Typography style={{fontWeight: "bold", color: "#2a4ea1"}}>{value?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</Typography> : key === "email"? <Typography style={{fontWeight: "bold", color: "#2a4ea1"}}>{String(value)}</Typography>: key === "balance" ||  key === "payingAmount" || key === "remAmount" || key === "prevAmount" || key === "amount" || key === "advance" || key === "prevAdvance" || key === "remAdvance" || key === "newSellingPrice" || key === "costPrice" || key === "oldSellingPrice" || key === "differenceValue"  ? <Typography style={{fontWeight: "bold", color: "#2a4ea1"}}>{value?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</Typography> : <Typography style={{fontWeight: "bold", color: "#2a4ea1"}}>{capitalizeEachWord(String(value))}</Typography>}
              </Box>
            </Grid>
          )
        })
        // console.log(check)


      }
    </Grid>
  )
}

export default DetailsPaper