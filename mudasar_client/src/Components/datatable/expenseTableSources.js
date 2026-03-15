import { Delete, Edit, Info} from "@mui/icons-material";
import { IconButton } from "@mui/material";

// SAMPLE DATA FOR USERS
//Export Expense Columns
export const expenseColumns = (setOpenDeleteDialog, setDetailsDialog, setOpenFormDialog) => [
  {
    field: "name",
    headerName: "Expense Name",
    width: 230
  },
  { field: "description", headerName: "Description", width: 300 },
  { field: "amount", headerName: "Amount", width: 150, renderCell: (params) => {
    return <div className="cellAction">{params.row.amount?.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0}</div>;
  }, },
  { field: "date", headerName: "Date", width: 150 },
  {
    field: "action",
    headerName: "Action",
    width: 130,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row.status === "open" && <IconButton
            className="viewButton"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Delete style={{ fontSize: "20px" }} />
          </IconButton>}
        </div>
      );
    },
  },
];

