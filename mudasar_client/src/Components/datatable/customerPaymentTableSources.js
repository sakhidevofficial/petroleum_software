
import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip} from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Customer Payment Columns
export const customerPaymentColumns = (
  setOpenDeleteDialog,
  setOpenDetailsDialog,
  setOpenFormDialog
) => [
  {
    field: "name",
    headerName: "Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            src={
              params.row.customer_pic
                ? `${DOMAIN}/public/customers/images/${params.row.customer_pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          />
           {params.row.name != null && params.row.name.length > 30
            ? params.row.name.substring(0, 30) + `....`
            : (params.row.name ?? "")}
        </div>
      );
    },
  },
  {
    field: "prevAmount",
    headerName: "Previous Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.prev_amount
            ? parseFloat(params.row.prev_amount).toLocaleString("en-US", {
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
    field: "amount",
    headerName: "Paid Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.paying_amount
            ? parseFloat(params.row.paying_amount).toLocaleString("en-US", {
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
    field: "remaining",
    headerName: "Remaining Amount",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.rem_amount
            ? parseFloat(params.row.rem_amount).toLocaleString("en-US", {
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
    width: 150,
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          
           <Tooltip title="Customer Payment Details">
          <IconButton
            className="viewButton"
            onClick={() => setOpenDetailsDialog(true)}
          >
            <Info style={{ fontSize: "20px" }} />
          </IconButton>
          </Tooltip>
          {params.row.status === "open" && (
            <>
            <Tooltip title="Edit Customer Payment">
             <IconButton
            className="viewButton"
            onClick={() => {
              setOpenFormDialog(true);
            }}
          >
            <Edit style={{ fontSize: "20px" }} />
          </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer Payment">

         
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
