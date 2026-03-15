import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export wastage Columns
export const wastageColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 300,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            src={
              params.row.product_pic
                ? `${DOMAIN}/public/products/images/${params.row.product_pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          />
          {params.row.product_name}
        </div>
      );
    },
  },
  { field: "quantity", headerName: "Quantity", width: 250 },
  { field: "date", headerName: "Date", width: 250 },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellAction">
         
          {params.row.status === "open" && (
            <>
              {/* <Tooltip title="Edit Wastage">
                <IconButton
                  className="viewButton"
                  onClick={() => {
                    setOpenFormDialog(true);
                  }}
                >
                  <Edit style={{ fontSize: "20px" }} />
                </IconButton>
              </Tooltip> */}
              <Tooltip title="Delete Wastage">
                <IconButton
                  className="viewButton"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <Delete style={{ fontSize: "20px" }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      );
    },
  },
];
