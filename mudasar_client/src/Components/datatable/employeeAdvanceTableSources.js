import { Delete, Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Employee Payment Columns
export const employeeAdvanceColumns = (
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
          {params.row.employee_name}
        </div>
      );
    },
  },
  {
    field: "description",
    headerName: "Description ",
    width: 300,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.description?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0}
        </div>
      );
    },
  },
  {
    field: "amount",
    headerName: "Amount",
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
    field: "date",
    headerName: "Date",
    width: 150,
    renderCell: (params) => {
      return <div className="cellAction">{params.row.date}</div>;
    },
  },

  {
    field: "action",
    headerName: "Action",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Tooltip title="Employee Advance Details">
            <IconButton
              className="viewButton"
              onClick={() => setOpenDetailsDialog(true)}
            >
              <Info style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          {params.row.status === "open" && (
            <Tooltip title="Delete Employee Advance">
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
