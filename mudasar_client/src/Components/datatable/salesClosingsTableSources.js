import { Delete, Edit, Info, NoEncryption, Print } from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { DOMAIN } from "../../backend/API";
import LockIcon from "@mui/icons-material/Lock";
//Export sales Columns
export const salesClosingsColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  handlePrint,
  user
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Cashier Name",
    width: 250,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            src={
              params.row.cashier_pic
                ? `${DOMAIN}/public/users/images/${params.row.cashier_pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"
          />
          {params.row.cashier_name && params.row.cashier_name.length > 11
            ? params.row.cashier_name.substring(0, 11) + `....`
            : params.row.cashier_name}
        </div>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 250,
  },
  {
    field: "status",
    headerName: "Status",
    width: 250,
    renderCell: (params) => {
      return (

         <div style={{ background: params.row.status === "open" ? "#02bf2e" : "#999", color: "white", width: 75, display: "flex", justifyContent:"center", alignItems: "center", borderRadius: 4 }}>
       {params.row.status === "open" ? <NoEncryption style={{ height: 15, width: 15, marginRight:5 }} /> : <LockIcon style={{ height: 15, width: 15, marginRight: 5 }} />} {params.row.status}
      </div>
       
      );
    },
  },

  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Tooltip title="Print Report">
            <IconButton
              className="viewButton"
              onClick={() => handlePrint(params.row.id)}
            >
              <Print style={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
          {/* <IconButton className="viewButton" onClick={()=>setDetailsDialog(true)}>
            <Info style={{ fontSize: "20px" }} />
          </IconButton> */}
          {params.row.status === "open" && user.access === "web_admin" && (
            <Tooltip title="Delete Closing">
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
