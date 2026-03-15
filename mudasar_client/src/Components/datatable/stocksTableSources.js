import { Padding } from "@mui/icons-material";
import { Chip } from "@mui/material";

//Export stocks Columns
export const stocksColumns = (
  setOpenDeleteDialog,
  setDetailsDialog,
  setOpenFormDialog
) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "product_name",
    headerName: "Product Name",
    width: 400,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {params.row?.product_name}
        </div>
      );
    },
  },
  { field: "stock", headerName: "Quantity", width: 400, renderCell: (params) => {
      const val = params.row?.stock;
      const num = val != null && val !== "" ? parseFloat(val) : NaN;
      return (
        <div className="cellAction">
          {Number.isFinite(num) ? num.toFixed(2) : ""}
        </div>
      );
    }, },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          {(() => {
            const stock = parseFloat(params.row.stock) || 0;
            const type = (params.row.product_type || "").toLowerCase();

            const commonStyle = {
              color: "white",
              width: 100,
              textAlign: "center",
              borderRadius: 4,
              padding: 2
            };

            if (type === "petrol" || type === "diesel") {
              if (stock <= 0) {
                return (
                  <div style={{ ...commonStyle, background: "#ff5849ff" }}>
                    Out of Stock
                  </div>
                );
              } else if (stock < 2000) {
                return (
                  <div style={{ ...commonStyle, background: "#ffc953ff" }}>
                    Stock Warning
                  </div>
                );
              } else {
                return (
                  <div style={{ ...commonStyle, background: "#07bc58" }}>
                    Available
                  </div>
                );
              }
            } else {
              if (stock <= 0) {
                return (
                  <div style={{ ...commonStyle, background: "#ff5849ff" }}>
                    Out of Stock
                  </div>
                );
              } else if (stock <= 5) {
                return (
                  <div style={{ ...commonStyle, background: "#ffc953ff" }}>
                    Stock Warning
                  </div>
                );
              } else {
                return (
                  <div style={{ ...commonStyle, background: "#07bc58" }}>
                    Available
                  </div>
                );
              }
            }
          })()}
        </div>
      );
    },
  },
];
