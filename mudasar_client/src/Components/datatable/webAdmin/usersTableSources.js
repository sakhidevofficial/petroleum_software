import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Chip from '@mui/material/Chip';

//DATA TABLE FORMATE FOR USERS
//Export Users Columns
export const usersColumns = (setOpenDeleteDialog) =>[
    {
      field: "name",
      headerName: "Name",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img src="../img/profile_user.jpg" alt="" className="cellImg" />
            {params.row.name}
          </div>
        );
      },
    },
    // { field: "username", headerName: "Username", width: 200 },
    { field: "email", headerName: "Email", width: 200, sortable: false, },
    { field: "tenantName", headerName: "Company Name", width: 200,  sortable: false, },
    { field: "accessName", headerName: "Access Right", width: 200,  sortable: false,
    renderCell: (params) => {
      return <div style={{padding: "3px 5px", background: "#555",color: "#9f9f9f", borderRadius: "27px"}}>
        {params.row.accessName === 'web_admin' ? 'Web Admin': params.row.accessName === 'tenant_admin'? 'Tenant Admin': ""}
      </div>
    }
  },
    { field: "contact", headerName: "Contact", width: 200,  sortable: false, },
    { field: "address", headerName: "Address", width: 200,  sortable: false, },
  
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/tenants/update/${params.row.id}`}  style={{ textDecoration: "none" }}>
              <IconButton className="viewButton">
                <Edit style={{ fontSize: "20px" }} />
              </IconButton>
            </Link>
  
           {params.row.accessName !== "web_admin" && params.row.accessName !== "tenant_admin" && <IconButton onClick={() => setOpenDeleteDialog(true)}>
              <Delete style={{ fontSize: "20px" }} />
            </IconButton>}
          </div>
        );
      },
    },
  ]