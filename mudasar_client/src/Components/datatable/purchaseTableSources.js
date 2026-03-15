import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Purchase Columns
export const purchaseColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "supplier",
    headerName: "Supplier Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            src={
              params.row.supplier_pic
                ? `${DOMAIN}/public/suppliers/images/${params.row.supplier_pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          />
          {params.row.supplier_name}
        </div>
      );
    },
  },
  { field: "product_name", headerName: "Product Name", width: 150 },
  { field: "quantity", headerName: "Quantity", width: 120 },
  {
    field: "cost_price",
    headerName: "Cost Price",
    width: 130,
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
    field: "selling_price",
    headerName: "Selling Price",
    width: 130,
    renderCell: (params) => {
      return (
        <div>
          {params.row.selling_price
            ? parseFloat(params.row.selling_price).toLocaleString("en-US", {
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
    width: 100,
    renderCell: (params) => {
      return (
        
        <div className="cellAction">
        {params.row.status === "open" && 
        <>
          {/* <Tooltip title="Edit Purchase">
            <IconButton
              className="viewButton"
              onClick={() => {
                setOpenFormDialog(true);
              }}
            >
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Delete Purchase">
            <IconButton
              className="viewButton"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Delete style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          </>
          }
        </div>
      );
    },
  },
];
