import { Box } from "@mui/material";
import React from "react";
import DataTable from "../../../Components/datatable/DataTable";
import Header from "../../../Components/Header/Header";
import { subColumns, subRows } from "../../../Components/datatable/dataTableSources";

export default function Subscription() {
  return (
    <Box m="0px 20px 20px 20px">
      {/* Header for subscription page  */}
      <Header title="SUBSCRIPTION" subTitle="Managing the Subscription Plans" />
      {/* Data Table of Subscription Plans */}
      <DataTable columns={subColumns} rows={subRows} />
    </Box>
  );
}
