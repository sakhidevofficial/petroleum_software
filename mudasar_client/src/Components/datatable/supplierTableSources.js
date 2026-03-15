import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";

// SAMPLE DATA FOR USERS
//Export Supplier Columns
export const supplierColumns = (
  setOpenDeleteDialog,
  setOpenDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            src={
              params.row.pic
                ? `${DOMAIN}/public/suppliers/images/${params.row.pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          />
          {params.row.name.length > 11
            ? params.row.name.substring(0, 11) + `....`
            : params.row.name}
        </div>
      );
    },
  },
  // { field: "email", headerName: "Email", width: 230 },
  {
    field: "balance",
    headerName: "Payable",
    width: 150,
    renderCell: (params) => {
      const bal = parseFloat(params.row.balance ?? 0);
      return (
        <div className="cellAction">
          {Number.isFinite(bal)
            ? bal.toLocaleString("en-US", { style: "currency", currency: "PKR", minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : "Rs. 0.00"}
        </div>
      );
    },
  },
  { field: "contact", headerName: "Contact", width: 130 },
  { field: "company_name", headerName: "Company", width: 130 },
  { field: "address", headerName: "Address", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 90,
    renderCell: (params) => {
      return (
        <div
          style={{
            background: params.row.status === "Active" ? "#02bf2e" : "#999",
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
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Tooltip title="Supplier Details">
            <IconButton
              className="viewButton"
              onClick={() => setOpenDetailsDialog(true)}
            >
              <Info style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Supplier">
            <IconButton
              className="viewButton"
              onClick={() => {
                setOpenFormDialog(true);
              }}
            >
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Supplier">
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
