import React from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { ClickAwayListener, Pagination, Stack } from "@mui/material";

const DataTable = ({ columns, footer, rows, totalRecords,selectedRowId, handleOnPageChange, currentPage, setSelectedRowId  }) => {
 
return (
<div className="datatable">
    <DataGrid
        className="dataGrid"
        rows={rows}
        columns={columns}
        pageSize={5}
        disableColumnFilter
        rowCount={totalRecords}
        paginationMode="server"
        components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Record Available
              </Stack>
            ),
            Pagination: footer ? () => null  : undefined , // Hides the pagination component
          }}
        page={currentPage}
        onSelectionModelChange={item => setSelectedRowId(item)}
        selectionModel={selectedRowId ? [selectedRowId] : []}
        onPageChange={(e)=> {handleOnPageChange(e)}}
        rowsPerPageOptions={[5]}
        checkboxSelection={false} // Enable checkbox selection
        disableRowSelectionOnClick
    />
   
</div>
);
};

export default DataTable;
