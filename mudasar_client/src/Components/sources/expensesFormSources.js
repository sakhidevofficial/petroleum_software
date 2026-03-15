//Add new expense form fields
export const expenseInputFields = (selectedRowId, currentData) => [
    {
      id: 1,
      label: "Expense Name",
      type: "text",
      name: "name",
      grid: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6
      }
    },
    {
      id: 2,
      label: "Amount",
      type: "number",
      name: "amount",
      grid: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6
      }
    },
    {
      id: 3,
      label: "Description",
      type: "text",
      name: "description",
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }
    },
    {
      id: 5,
      label: "Date",
      type: "date",
      name: "date",
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }
    },
    {
        id: 6,
        label: selectedRowId !== null && Object.keys(currentData).length !== 0 ? "Update Expense":"Add Expense",
        type: "button",
        btntype: "submit",
        color: "primary",
        variant: "contained",
        grid: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
        }
      },
    
  ];

//SEARCH Expense Filters
export const searchExpenseFilters = (filter) => {
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
        filter.field !== 'date' && { id: 1, name: "Contains", value: "$regex" },
        filter.field !== 'date' && { id: 2, name: "Equals", value: "$eq" },
        filter.field === 'date' && { id: 7, name: "In Between", value: "inBetween" },

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
        lg: 4
      },
     
      options: [
        { id: 1, name: "Name", value: "name" },
        { id: 2, name: "Description", value: "description" },
        { id: 3, name: "Date", value: "date" },
      ]
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
          lg: 4 
        },
      },
  ]
}