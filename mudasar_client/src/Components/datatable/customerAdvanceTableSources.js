
import { Delete, Edit, Info, } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Customer Payment Columns
export const customerAdvanceColumns = (
  setOpenDeleteDialog,
  setOpenDetailsDialog,
  setOpenFormDialog
) => [
  {
    field: "name",
    headerName: "Name",
    width: 250,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
           <img
            src={
              params.row.pic
                ? `${DOMAIN}/public/customers/images/${params.row.pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          />
          {params.row.name.length > 30
            ? params.row.name.substring(0, 30) + `....`
            : params.row.name}
        </div>
      );
    },
  },
  {
    field: "description",
    headerName: "Description",
    width: 250,
    renderCell: (params) => {
      return <div className="cellAction">{params.row.description}</div>;
    },
  },
  { field: "amount", headerName: "Amount", width: 150,  renderCell: (params) => {
    return <div className="cellAction">{params.row.amount?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0}</div>;
  }, },
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
         
          <Tooltip title="Customer Advance Detials">
          <IconButton
            className="viewButton"
            onClick={() => setOpenDetailsDialog(true)}
          >
            <Info style={{ fontSize: "20px" }} />
          </IconButton>
           </Tooltip>

          {params.row.status === "open" && 
          <>
           <Tooltip title="Edit Customer Advance">
          <IconButton
            className="viewButton"
            onClick={() => {
              setOpenFormDialog(true);
            }}
          >
            <Edit style={{ fontSize: "20px" }} />
          </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer Advance">
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

