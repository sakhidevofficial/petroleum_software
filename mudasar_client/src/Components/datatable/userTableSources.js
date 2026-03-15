import { Link } from "react-router-dom";
import { Delete, Edit, Info, Style } from "@mui/icons-material";
import { IconButton, Chip, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

// SAMPLE DATA FOR USERS
//Export User Columns
export const userColumns = (
  setOpenFormDialog,
  setDetailsDialog,
  setOpenDeleteDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {console.log(params.row.pic)}
          <img
            src={
              params.row.pic
                ? `${DOMAIN}/public/users/images/${params.row.pic}`
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
  { field: "email", headerName: "Email", width: 230 },
  { field: "contact", headerName: "Contact", width: 150 },
  { field: "access", headerName: "Role", width: 120 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
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
          <Tooltip title="Edit User">
            <IconButton
              className="viewButton"
              onClick={() => {
                setOpenFormDialog(true);
              }}
            >
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="User Details">
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
//DATA TABLE FORMATE FOR TENANTS
export const tenantsRows = [
  {
    id: 1,
    name: "Kashif Hussain",
    image: "img/blackberry.png",
    email: "kashif@gmail.com",
    tenantName: "Saimon Technologies",
    contact: "0302-2365926",
    address: "Qaim colony Naushahro feroze",
  },
  {
    id: 2,
    name: "Kashif Hussain",
    image: "img/blackberry.png",
    // username: "kashif",
    email: "kashif@gmail.com",
    tenantName: "Saimon Technologies",
    contact: "0302-2365926",
    address: "Qaim colony Naushahro feroze",
  },
];
