
import { Link } from "react-router-dom";
import { Delete, Edit, Style } from "@mui/icons-material";
import { IconButton, Chip } from "@mui/material";

//Export User Columns
export const reportColumns = [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "description",
    headerName: "Description",
    width: 350,
    headerAlign: "center",
    renderCell: (params) => {
      return (
        <div className="cellWithImg" >
          {params.row.heading ? <div style={{fontWeight: 800}}>{params.row.heading}</div> : <div>{params.row.description}</div>} 
        </div>
      );
    },
  },
  { field: "quantity", headerName: "Liters/Qty", width: 250, headerAlign: "center" },
  { field: "amount", headerName: "Amount", width: 170, headerAlign: "center",  renderCell: (params) => {
    return (
      <div className="cellWithImg" >
        {params.row?.amount && <span> Rs. {params.row?.amount}</span>} 
      </div>
    );
  }, },
  { field: "profit", headerName: "Profit", width: 170, headerAlign: "center",  renderCell: (params) => {
    return (
      <div className="cellWithImg">
        {params.row?.grossTotalProfit ? <div style={{fontWeight: 800}}>Rs. {params.row.grossTotalProfit}</div> : <div> {params.row.totalProfit && <span> Rs. {params.row.totalProfit}</span>}</div>} 
      </div>
    );
  }, },
];







