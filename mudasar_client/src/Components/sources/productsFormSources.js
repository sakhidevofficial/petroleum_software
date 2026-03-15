//Add new product form fields
export const productInputFields = (selectedRowId, currentData) => [
    {
      id: 1,
      label: "Product Name",
      type: "text",
      name: "name",
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
    {
      id: 2,
      label: "Type",
      type: "select",
      name: "type",
      options: [
        // Here we are setup the filter operator items 
        { id: 1, name: "Petrol", value: "petrol" },
        { id: 2, name: "Diesel", value: "diesel" },
        { id: 3, name: "Mobile", value: "mobile" },
      ],
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
    {
      id: 3,
      label: "Cost Price",
      type: "number",
      name: "costPrice",
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
    {
      id: 4,
      label: "Selling Price",
      type: "number",
      name: "sellingPrice",
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
     {
      id: 5,
      label: "Status",
      type: "select",
      name: "status",
      options: [
        // Here we are setup the filter operator items 
        { id: 1, name: "Active", value: "active" },
        { id: 2, name: "Deactive", value: "deactive" },
      ],
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
     {
      id: 6,
      label: "Date",
      type: "date",
      name: "date",
      grid: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6
      }
    },
    {
        id: 7,
        label: selectedRowId !== null && Object.keys(currentData).length !== 0 ? "Update Product":"Add Product",
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

//SEARCH Product Filters
export const searchProductFilters = (filter) => {
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
        { id: 2, name: "type", value: "type" },
        { id: 3, name: "Status", value: "status" },
        { id: 4, name: "Date", value: "date" },
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

//SEARCH Employee Filters
export const searchEmployeeFilters = (filter) => {
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
        { id: 4, name: "Designation", value: "designation" },
        { id: 5, name: "Advance", value: "advance" },
        { id: 6, name: "Address", value: "address" },
        { id: 7, name: "Status", value: "status" },
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

//SEARCH EMPLOYEES INPUTS
export const searchEmployeeInput = (filter) => {
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