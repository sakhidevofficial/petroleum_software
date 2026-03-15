import { DOMAIN } from "../../backend/API";

//Add new employee Payment form fields
export const employeePaymentInputFields = (selectedRowId, currentData, employees) => [
  {
    id: 1,
    label: "Employee",
    type: "select",
    name: "employeeId",
    disabled: Object.entries(currentData).length > 0 ? true : false,
    options:
      employees.length > 0 &&
      employees.map((item) => {
        const adv = parseFloat(item.remaining_advance ?? item.advance ?? 0);
        return {
          id: item.id,
          name: item.name,
          value: item.id,
          avatarUrl: `${DOMAIN}/public/employees/images/${item.pic || ""}`,
          avatarAlt: "./img/avatarfile.png",
          salary: Number.isFinite(adv)
            ? adv.toLocaleString("en-US", { style: "currency", currency: "PKR", minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : "Rs. 0.00",
        };
      }),
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
      selectedRowId !== null && Object.keys(currentData).length !== 0
        ? "Update Employee Payment"
        : "ADD EMPLOYEE PAYMENT",
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

//SEARCH Customer Payment Filters
export const searchEmployeePaymentFilters = (filter) => {
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

//SEARCH CUSTOMERS INPUTS
export const searchCustomerInput = (filter) => {
  return [
    filter.field !== "date" &&
      filter.field !== "contact" && {
        id: 1,
        label: `Enter ${filter?.field
          .replace(/^_/, "") // Remove underscore at the beginning, if any
          .replace(/([A-Z])/g, " $1") // Split on the basis of uppercase and capitalize each word
          .replace(/^./, function (str) {
            return str.toUpperCase();
          })}`,
        type: "text",
        disabled: filter.field === "" ? true : false,
        name: "searchInput",
        grid: {
          xs: 12,
          sm: 10,
        },
      },
    filter.field === "date" &&
      filter.operator === "inBetween" && {
        id: 2,
        label: "Start Date",
        type: "date",
        name: "startDate",
        grid: {
          xs: 12,
          sm: filter.operator === "inBetween" ? 5 : 10,
        },
      },
    filter.field === "date" &&
      filter.operator === "inBetween" && {
        id: 3,
        label: "End Date",
        type: "date",
        name: "endDate",
        grid: {
          xs: 12,
          sm: 5,
        },
      },
    filter.field === "contact" && {
      id: 4,
      type: "phone",
      name: "searchInput",
      grid: {
        xs: 12,
        sm: 8,
        md: 8,
        lg: 10,
      },
    },
    {
      id: 5,
      label: "Search",
      type: "button",
      btntype: "submit",
      variant: "contained",
      color: "primary",
      grid: {
        xs: 12,
        sm: 2,
      },
    },
  ];
};
