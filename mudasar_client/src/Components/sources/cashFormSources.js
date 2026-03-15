//Add new customer form fields
export const cashInputFields = (selectedRowId, currentCustomer) => [
    {
      id: 1,
      label: "Name",
      type: "text",
      name: "name",
      disabled: true,
      tabIndex: 0,
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
    {
      id: 2,
      label: "Cash",
      tabIndex: 1,
      type: "number",
      disabled: true,
      name: "cash",
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
   
    {
      id: 3,
      label: "Description",
      tabIndex: 2,
      type: "text",
      name: "description",
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
    {
      id: 4,
      label: "Cash Date",
      tabIndex: 3,
      type: "date",
      disabled: true,
      name: "date",
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
    {
      id: 5,
      label: "Collection Date",
      tabIndex: 3,
      type: "date",
      name: "collectionDate",
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
    {
      id: 6,
      label: "Status",
      type: "select",
      tabIndex: 5,
      disable: false,
      name: "status",
      size: "small",
      minWidth: "100wh",
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,  
      },
      options: [
        { id: 1, name: "Pending", value: "pending" },
        { id: 2, name: "Collected", value: "collected" },
      ],
    },
    {
        id: 7,
        label: selectedRowId !== null && Object.keys(currentCustomer).length !== 0 ? "Update Collection":"Collected",
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
        }
      },
    
  ];


//SEARCH CustomerS Filters
export const searchCustomerFilters = (filter) => {
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
        { id: 2, name: "Email", value: "email" },
        { id: 3, name: "Contact", value: "contact" },
        { id: 4, name: "Balance", value: "balance" },
        { id: 5, name: "Address", value: "address" },
        { id: 6, name: "Status", value: "status" },
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

//SEARCH CUSTOMERS INPUTS
export const searchCustomerInput = (filter) => {
  return [
    filter.field !== "date" && filter.field !== "contact" && {
      id: 1,
      label: `Enter ${filter?.field.replace(/^_/, '') // Remove underscore at the beginning, if any
      .replace(/([A-Z])/g, ' $1') // Split on the basis of uppercase and capitalize each word
      .replace(/^./, function(str){ return str.toUpperCase(); })}`,
      type: "text",
      disabled: filter.field === "" ? true : false,
      name: "searchInput",
      grid: {
        xs: 12,
        sm: 10
      }
    },
    filter.field === "date" && filter.operator === "inBetween" && {
      id: 2,
      label: "Start Date",
      type: "date",
      name: "startDate",
      grid: {
        xs: 12,
        sm: filter.operator === "inBetween" ? 5 : 10
      }
    },
    filter.field === "date" && filter.operator === "inBetween" && {
      id: 3,
      label: "End Date",
      type: "date",
      name: "endDate",
      grid: {
        xs: 12,
        sm: 5
      }
    },
    filter.field === "contact" && {
      id: 4,
      type: "phone",
      name: "searchInput",
      grid: {
        xs: 12,
        sm: 8,
        md: 8,
        lg: 10
      }
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
        sm: 2  
      },
    },
  ]
}