import { DOMAIN } from "../../backend/API";

//Add new supplier Payment form fields
function ensureSupplierOptions(suppliers) {
  if (!suppliers || !Array.isArray(suppliers)) return [];
  return suppliers.map((item) => {
    const sid = item.id ?? item._id;
    const numId = typeof sid === "number" && Number.isInteger(sid) ? sid : parseInt(sid, 10);
    const value = !Number.isNaN(numId) && numId >= 1 ? numId : sid;
    const balance = parseFloat(item.balance ?? 0);
    return {
      id: value,
      name: item.name ?? item.company_name ?? "",
      value,
      avatarUrl: `${DOMAIN}/public/suppliers/images/${item.pic || ""}`,
      avatarAlt: "./img/avatarfile.png",
      salary: Number.isFinite(balance)
        ? balance.toLocaleString("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "Rs. 0.00",
    };
  });
}

export const supplierPaymentInputFields = (
  selectedRowId,
  currentSupplier,
  suppliers
) => [
  {
    id: 1,
    label: "Supplier",
    type: "select",
    name: "supplierId",
    disabled: currentSupplier && Object.keys(currentSupplier).length > 0,
    options: ensureSupplierOptions(suppliers),
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
    },
  },
  {
    id: 2,
    label: "Amount",
    tabIndex: 1,
    type: "number",
    name: "amount",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 3,
    label: "Date",
    type: "date",
    name: "date",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
    },
  },
  {
    id: 4,
    label:
      selectedRowId !== null && currentSupplier && Object.keys(currentSupplier).length !== 0
        ? "UPDATE SUPPLIER PAYMENT"
        : "ADD SUPPLIER PAYMENT",
    type: "button",
    tabIndex: 6,
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

//SEARCH Supplier Payment Filters
export const searchSupplierPaymentFilters = (filter) => {
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
        // filter.field !== "date" && { id: 2, name: "Equals", value: "$eq" },
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
        { id: 1, name: "Name", value: "name" },
        { id: 2, name: "Date", value: "date" },
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
