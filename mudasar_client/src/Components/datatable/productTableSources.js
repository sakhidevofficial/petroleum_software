import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Product Columns
export const productColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            src={
              params.row.pic
                ? `${DOMAIN}/public/products/images/${params.row.pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          />
          {params.row.name}
        </div>
      );
    },
  },
  { field: "type", headerName: "Type", width: 100 },
  {
    field: "cost_price",
    headerName: "Cost Price",
    width: 150,
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
            : ""}
        </div>
      );
    },
  },
  {
    field: "new_selling_price",
    headerName: "Selling Price",
    width: 140,
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
    field: "price_date",
    headerName: "Last Updated",
    width: 120,
    renderCell: (params) => {
      return <div>{params.row.price_date || ""}</div>;
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 90,
    renderCell: (params) => {
      return (
        <div
          style={{
            background:
              params.row.status.toLowerCase() === "active" ? "#02bf2e" : "#999",
            color: "white",
            width: 65,
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          {params.row.status}
        </div>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Tooltip title="Edit Product">
            <IconButton
              className="viewButton"
              onClick={() => {
                setOpenFormDialog(true);
              }}
            >
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Product Details">
            <IconButton
              className="viewButton"
              onClick={() => setDetailsDialog(true)}
            >
              <Info style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>

          {/* <IconButton
            className="viewButton"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Delete style={{ fontSize: "20px" }} />
          </IconButton> */}
        </div>
      );
    },
  },
];
