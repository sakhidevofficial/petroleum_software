import { Delete, Edit, Info} from "@mui/icons-material";
import { IconButton } from "@mui/material";

// SAMPLE DATA FOR USERS
//Export Reading Columns
export const readingColumns = (setOpenDeleteDialog, setDetailsDialog, setOpenFormDialog) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Machine",
    width: 200,
  },
  // { field: "email", headerName: "Email", width: 230 },
  { field: "type", headerName: "Type", width: 200 },
  { field: "prev_reading", headerName: "Previous Reading", width: 200 },
  { field: "new_reading", headerName: "Current Reading", width: 200 },
  { field: "date", headerName: "Date", width: 130 },
  
];

