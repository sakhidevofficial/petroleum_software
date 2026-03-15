import { DOMAIN } from "../../backend/API";

//Add new purchase form fields
export const purchaseInputFields = (
  selectedRowId,
  currentData,
  products,
  suppliers
) => [
  {
    id: 1,
    label: "Select Product",
    type: "select",
    name: "productId",
    options:
      products.length > 0 &&
      products.map((item) => ({ id: item.id, name: item.name, value: item.id })),
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 2,
    label: "Select Supplier",
    type: "select",
    name: "supplierId",
    options:
      suppliers.length > 0 &&
      suppliers.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.id,
        avatarUrl: `${DOMAIN}/public/suppliers/images/${item.pic || ""}`,
        avatarAlt: "./img/avatarfile.png",
      })),
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 3,
    label: "Product Quantity",
    type: "number",
    name: "quantity",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 4,
    label: "Cost Price",
    type: "number",
    name: "costPrice",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 5,
    label: "Selling Price",
    type: "number",
    name: "sellingPrice",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 6,
    label: "Paying Amount",
    type: "number",
    name: "paidAmount",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 8,
    label: "Date",
    type: "date",
    name: "date",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
  {
    id: 9,
    label:
      selectedRowId !== null && Object.keys(currentData).length !== 0
        ? "Update Stock"
        : "Add Stock",
    type: "button",
    btntype: "submit",
    color: "primary",
    variant: "contained",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
];

//SEARCH Purchase Filters
export const searchPurchaseFilters = (filter) => {
  return [
    {
      id: 1,
      label: "Condition",
      type: "select",
      disable: filter.operator === "inBetween" ? true : false,
      name: "operator",
      size: "small",
      minWidth: "100wh",
      grid: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4,
      },
      options: [
        // Here we are setup the filter operator items
        filter.field !== "date" && { id: 1, name: "Contains", value: "$regex" },
        filter.field !== "date" && { id: 2, name: "Equals", value: "$eq" },
        filter.field === "date" && {
          id: 7,
          name: "In Between",
          value: "inBetween",
        },
      ],
    },
    {
      id: 2,
      label: "Select Column",
      type: "select",
      name: "field",
      size: "small",
      minWidth: "100wh",
      grid: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4,
      },

      options: [
        { id: 1, name: "Supplier Name", value: "supplier" },
        { id: 2, name: "Product Name", value: "product" },
        { id: 7, name: "Date", value: "date" },
      ],
    },
    {
      id: 3,
      label: "Sorting",
      type: "select",
      name: "sort",
      size: "small",
      options: [
        // Here we are setup the filter operator items
        { id: 1, name: "Ascending", value: 1 },
        { id: 2, name: "Descending", value: -1 },
      ],
      grid: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4,
      },
    },
  ];
};
