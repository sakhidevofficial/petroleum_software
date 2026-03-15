import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

//Export Customer Columns
export const customerColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
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
    field: "balance",
    headerName: "Receivable",
    width: 150,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.balance?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0}
        </div>
      );
    },
  },
  { field: "contact", headerName: "Contact", width: 150 },
  { field: "address", headerName: "Address", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div
          style={{
            background: params.row.status.toLowerCase() === "active" ? "#02bf2e" : "#999",
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
          <Tooltip title="Edit Customer">
            <IconButton
              className="viewButton"
              onClick={() => {
                setOpenFormDialog(true);
              }}
            >
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Detials">
            <IconButton
              className="viewButton"
              onClick={() => setDetailsDialog(true)}
            >
              <Info style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer">
            <IconButton
              className="viewButton"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Delete style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
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
