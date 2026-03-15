import { Link } from "react-router-dom";
import { Delete, Edit, Info, Money, Paid, Style } from "@mui/icons-material";
import { IconButton, Chip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Daily Cash Columns
export const dailyCashColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            src={
              params.row.user_pic
                ? `${DOMAIN}/public/users/images/${params.row.user_pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "cash",
    headerName: "Cash",
    width: 200,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus `}>
          {parseFloat(params.row.cash || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  { field: "description", headerName: "Description", width: 250 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => {
      return (
        <div
          style={{
            background: params.row.status.toLowerCase() === "pending" ? "#03a0f5" : "#999",
            color: "white",
            width: 70,
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          {params.row.status}
        </div>
      );
    },
  },
  { field: "date", headerName: "Date", width: 150 },
  {
    field: "action",
    headerName: "Action",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <IconButton
            className="viewButton"
            onClick={() => {
              setOpenFormDialog(true);
            }}
          >
            <Paid style={{ fontSize: "20px" }} />
          </IconButton>
        </div>
      );
    },
  },
];
