//Add new meter Reading form fields
export const machineInputFields = (selectedRowId, currentData) => [
    {
      id: 1,
      label: "Machine Name",
       disabled: Object.entries(currentData).length > 0  ? true : false,
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
      label: "Fuel Type",
      type: "select",
      disabled: Object.entries(currentData).length > 0 ? true : false,
      name: "type",
      options: [
        // Here we are setup the filter operator items 
        { id: 1, name: "Petrol", value: "petrol" },
        { id: 2, name: "Diesel", value: "diesel" },
      ],
      grid: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6
      }
    },
    {
      id: 3,
      label: "Initial Reading",
       disabled: Object.entries(currentData).length > 0  ? true : false,
      type: "number",
      name: "initialReading",
      grid: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6
      }
    },
    {
      id: 4,
      label: "Current Reading",
      type: "number",
       disabled: Object.entries(currentData).length > 0  ? true : false,
      name: "currentReading",
      grid: {
        xs: 12,
        sm: 6,
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
        md: 12,
        lg: 12
      }
    },
    {
        id: 6,
        label: selectedRowId !== null && Object.keys(currentData).length !== 0 ? "Update Machine":"Add Machine",
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

//SEARCH  Filters
export const searchReadingFilters = (filter) => {
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