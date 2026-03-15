import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export dips Columns
export const dipColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img
            src={
              params.row?.product.pic
                ? `${DOMAIN}/public/products/images/${params.row.product.pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          /> */}
          {params.row.product_name}
        </div>
      );
    },
  },
  { field: "prev_dip", headerName: "Last Dip", width: 80 },
  { field: "prevStock", headerName: "Last Stock", width: 150 },
  { field: "dip", headerName: "Dip Reading", width: 100 },
  { field: "stock", headerName: "Stock", width: 150 },
  { field: "stockDiff", headerName: "Stock Diff:", width: 100,
     renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.stockDiff != null ? parseFloat(params.row.stockDiff).toFixed(2) : ""}
        </div>
     )}
   },
  { field: "gain", headerName: "Gain", width: 100 },
  { field: "date", headerName: "Date", width: 130 },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {/* <IconButton
            className="viewButton"
            onClick={() => {
              setOpenFormDialog(true)
            }}
          >
            <Edit style={{ fontSize: "20px" }} />
          </IconButton> */}

          {/* <IconButton className="viewButton" onClick={()=>setDetailsDialog(true)}>
            <Info style={{ fontSize: "20px" }} />
          </IconButton> */}
          {params.row.status === "open" && (
            <Tooltip title="Delete Dip Reading">
              <IconButton
                className="viewButton"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <Delete style={{ fontSize: "20px" }} />
              </IconButton>
            </Tooltip>
          )}
        </div>
      );
    },
  },
];
