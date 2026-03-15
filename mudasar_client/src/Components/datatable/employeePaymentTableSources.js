
import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip} from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Employee Payment Columns
export const employeePaymentColumns = (
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
              params.row.employee_pic
                ? `${DOMAIN}/public/employees/images/${params.row.employee_pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          />
           {params.row.employee_name && params.row.employee_name.length > 30
            ? params.row.employee_name.substring(0, 30) + `....`
            : params.row.employee_name}
        </div>
      );
    },
  },
  {
    field: "prev_advance",
    headerName: "Previous Advance",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.prev_advance
            ? parseFloat(params.row.prev_advance).toLocaleString("en-US", { style: "currency", currency: "PKR", minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
          {params.row.amount
            ? parseFloat(params.row.amount).toLocaleString("en-US", { style: "currency", currency: "PKR", minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : 0}
        </div>
      );
    },
  },
  {
    field: "rem_advance",
    headerName: "Remaining Advance",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.rem_advance
            ? parseFloat(params.row.rem_advance).toLocaleString("en-US", { style: "currency", currency: "PKR", minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : 0}
        </div>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 100,
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          
           <Tooltip title="Employee Payment Details">
          <IconButton
            className="viewButton"
            onClick={() => setOpenDetailsDialog(true)}
          >
            <Info style={{ fontSize: "20px" }} />
          </IconButton>
          </Tooltip>
          {params.row.status === "open" && (
            <>
            <Tooltip title="Edit Employee Payment">
             <IconButton
            className="viewButton"
            onClick={() => {
              setOpenFormDialog(true);
            }}
          >
            <Edit style={{ fontSize: "20px" }} />
          </IconButton>
          </Tooltip>
          <Tooltip title="Delete Employee Payment">

         
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
