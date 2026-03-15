import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DOMAIN } from "../../backend/API";

// SAMPLE DATA FOR USERS
//Export Employee Columns
export const employeeColumns = (setOpenDeleteDialog, setOpenDetailsDialog, setOpenFormDialog) => [
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
                ? `${DOMAIN}/public/employees/images/${params.row.pic}`
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
  // { field: "email", headerName: "Email", width: 230 },
  {
    field: "salary",
    headerName: "Salary",
    width: 150,
    renderCell: (params) => {
      const sal = parseFloat(params.row.salary ?? 0);
      return (
        <div className={`cellWithStatus ${params.row.salary}`}>
          {Number.isFinite(sal)
            ? sal.toLocaleString("en-US", { style: "currency", currency: "PKR", minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : "Rs. 0.00"}
        </div>
      );
    },
  },
  {
    field: "remaining_advance",
    headerName: "Remaining Advance",
    width: 150,
    renderCell: (params) => {
      const adv = parseFloat(params.row.remaining_advance ?? params.row.advance ?? 0);
      return (
        <div className={`cellWithStatus ${params.row.remaining_advance}`}>
          {Number.isFinite(adv)
            ? adv.toLocaleString("en-US", { style: "currency", currency: "PKR", minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : "Rs. 0.00"}
        </div>
      );
    },
  },
  { field: "contact", headerName: "Contact", width: 130 },
  { field: "designation", headerName: "Designation", width: 130 },
  {
    field: "status",
    headerName: "Status",
    width: 90,
    renderCell: (params) => {
      return <div style={{ background: params.row.status === "Active" ? "#02bf2e" : "#777", color: "white", width: 65, textAlign: "center", borderRadius: 4 }}>
        {params.row.status}
      </div>
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <IconButton
            className="viewButton"
            onClick={() => {
              setOpenFormDialog(true)
            }}
          >
            <Edit style={{ fontSize: "20px" }} />
          </IconButton>

          <IconButton className="viewButton" onClick={() => setOpenDetailsDialog(true)}>
            <Info style={{ fontSize: "20px" }} />
          </IconButton>

          <IconButton
            className="viewButton"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Delete style={{ fontSize: "20px" }} />
          </IconButton>
        </div>
      );
    },
  },
];

