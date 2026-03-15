import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Price Columns
export const priceColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "product_name",
    headerName: "Name",
    width: 200,
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
  {
    field: "cost_price",
    headerName: "Cost Price",
    width: 120,
    renderCell: (params) => {
      return (
        <div>
          {params.row.cost_price
            ? parseFloat(params.row.cost_price).toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 0}
        </div>
      );
    },
  },
  {
    field: "old_selling_price",
    headerName: "Old Selling Price",
    width: 140,
    renderCell: (params) => {
      return (
        <div>
          {params.row.old_selling_price
            ? parseFloat(params.row.old_selling_price).toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 0}
        </div>
      );
    },
  },
  {
    field: "new_selling_price",
    headerName: "Selling Price",
    width: 120,
    renderCell: (params) => {
      return (
        <div>
          {params.row.new_selling_price
            ? parseFloat(params.row.new_selling_price).toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 0}
        </div>
      );
    },
  },
  {
    field: "difference_value",
    headerName: "Difference Amount",
    width: 170,
    renderCell: (params) => {
      return (
        <div>
          {params.row.difference_value
            ? parseFloat(params.row.difference_value).toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 0}
        </div>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 120,
    renderCell: (params) => {
      return <div>{params.row.date}</div>;
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 110,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Tooltip title="Price Details">
            <IconButton
              className="viewButton"
              onClick={() => setDetailsDialog(true)}
            >
              <Info style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>

          {params.row?.status === "open" && (
            <Tooltip title="Delete Price">
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
