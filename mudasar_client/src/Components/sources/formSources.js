//Add new feature form fields
export const featureInputFields = [
  {
    id: 1,
    label: "Name",
    type: "text",
    name: "name",
  },
  {
    id: 2,
    label: "Desciption",
    type: "text",
    name: "description",
  },
  {
    id: 3,
    label: "Status",
    type: "select",
    name: "status",
    size: "small",
    minWidth: "100%",
    options: [
      { id: 1, name: "Active", value: "active" },
      { id: 2, name: "Deactive", value: "deactive" },
    ],
  },
];

//ADD NEW PACKAGE FORM FIELDS
export const packagesInputFields = (submitBtnTitle) => { 
  return [
    {id: 1, type: "file", grid: {xs: 12, sm: 12}},
  {
    id: 2,
    label: "Name",
    type: "text",
    name: "name",
    grid: {
      xs: 12,
      sm: 6
    }
    // placeholder: "john_doe",
  },
  {
    id: 3,
    label: "Price",
    type: "number",
    name: "price",
    grid: {
      xs: 12,
      sm: 6
    }
  },
  {
    id: 4,
    label: "Desciption",
    type: "text",
    name: "description",
    grid: {
      xs: 12,
      sm: 8
    }
    // placeholder: "john_doe",
  },
 
  {
    id: 5,
    label: "Expires in months",
    type: "number",
    name: "expiresInMonths",
    grid: {
      xs: 12,
      sm: 4
    }
  },
  {
    id: 6,
    label: "Status",
    type: "select",
    name: "status",
    size: "small",
    minWidth: "100wh",
    options: [
      { id: 1, name: "Active", value: "active" },
      { id: 2, name: "De-Active", value: "deactive" }
    ],
    grid: {
      xs: 12,
      sm: 6
    }
    // placeholder: "john_doe",
  },
  {
    id: 7,
    type: "colorInput",
    grid: {
      xs: 12,
      sm: 6
    }
    // placeholder: "john_doe",
  },
  {
    id: 8,
    label: submitBtnTitle,
    type: "button",
    btntype: "submit",
    color: "primary",
    variant: "contained",
    grid: {
      xs: 12,
      sm: 12
    }
  },
]; }

//ADD NEW PACKAGE GROUP FORM FIELDS
export const packageGroupForm = () => {
  return [
    {
      id: 1,
      label: "Group Title",
      type: "text",
      name: "groupTitle",
      grid: {
        xs: 12,
        sm: 6
      }
    },
    {
      id: 2,
      label: "Group Status",
      type: "select",
      name: "groupStatus",
      size: "small",
      minWidth: "100wh",
      options: [
        { id: 1, name: "Active", value: true},
        { id: 2, name: "De-Active", value: false }
      ],
      grid: {
        xs: 12,
        sm: 6
      }
    },
    {
      id: 3,
      label: "Group Description",
      type: "text",
      name: "groupDescription",
      grid: {
        xs: 12,
        sm: 9
      }
    },
    {
      id: 4,
      label: "Add Group",
      type: "button",
      btntype: "submit",
      color: "primary",
      variant: "contained",
      grid: {
        xs: 12,
        sm: 3
      }
    },
  ]
}

//ADD NEW PACKAGE FEATURE IN PACKAGE GROUP FORM FIELDS
export const packageFeatureForm = (features, groups) => {
  return [
    {
      id: 1,
      label: "Select Group",
      type: "select",
      name: "selectgroup",
      class: "group",
      size: "small",
      options: groups?.map(item => {
        return { id: item.id, name: item.groupTitle, value: item.id }
      }),
       
      grid: {
        xs: 12,
        sm: 4
      }
      // placeholder: "john_doe",
    },
    {
      id: 2,
      label: "Select Feature",
      type: "select",
      name: "selectfeature",
      size: "small",
      minWidth: "100wh",
      options: features.map(item => {
          return { id: item.id, name: item.feature, value: item.id }
        })
      ,
      grid: {
        xs: 12,
        sm: 5
      }
    },
    {
      id: 3,
      label: "Add Feature",
      type: "button",
      btntype: "submit",
      color: "primary",
      variant: "contained",
      grid: {
        xs: 12,
        sm: 3
      }
    },
  ]
}

//ADD NEW TENANT FORM 
export const tenantForm = (submitBtnTitle, packages) => {
  return [
  {
    id: 1,
    label: "Owner Name",
    type: "text",
    name: "ownerName",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 4
    }
  },
  {
    id: 2,
    label: "Username",
    type: "text",
    name: "username",
    grid: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 4
    }
  },
  {
    id: 3,
    label: "Phone",
    type: "phone",
    name: "phone",
    size: "small",
    minWidth: "100wh",
    grid: {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 4
    }
  },
  {
    id: 4,
    label: "Email",
    type: "email",
    name: "email",
    grid: {
      xs: 12,
      sm: 6
    }
  },
  {
    id: 5,
    label: "Company Name",
    type: "text",
    name: "tenantName",
    grid: {
      xs: 12,
      sm: 6
    }
  },
 
  {
    id: 6,
    label: "Select Package",
    type: "select",
    name: "packageId",
    size: "small",
    minWidth: "100wh",
    options: packages && packages.map(item => {
      return {id: item._id, name: `${item.name} ( Price: ${item.price} - Months: ${item.expiresInMonths} )`, value: item._id}
    }),
    grid: {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 4
    }
  },
  {
    id: 7,
    label: "Date",
    type: "date",
    name: "date",
    grid: {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 4
    }
  },
 
  {
    id: 8,
    label: "Status",
    type: "select",
    name: "status",
    size: "small",
    minWidth: "100wh",
    options: [
      { id: 1, name: "Active", value: "active" },
      { id: 2, name: "De-Active", value: "deactive" }
    ],
    grid: {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 4
    }
  },
  {
    id: 9,
    label: "Address",
    type: "text",
    name: "address",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 6
    }
  },
  
  {
    id: 10,
    label: "Password",
    type: "password",
    name: "password",
    grid: {
      xs: 12,
      sm: 6,
      md: 3,
      lg: 3,
    }
  },
  {
    id: 11,
    label: "Confirm Password",
    type: "password",
    name: "confirmPassword",
    grid: {
      xs: 12,
      sm: 6,
      md: 3,
      lg: 3,
    }
  },
  
  {
    id: 12,
    label: submitBtnTitle,
    type: "button",
    btntype: "submit",
    variant: "contained",
    color: "secondary",
    grid: {
      xs: 12,
      sm: 12
    }
  },
  ]
}

//SEARCH TENANTS Filters
export const searchTenantFilters = (filter) => {
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
        { id: 1, name: "Owner Name", value: "ownerName" },
        { id: 2, name: "Username", value: "username" },
        { id: 3, name: "Email", value: "email" },
        { id: 4, name: "Company Name", value: "tenantName" },
        { id: 5, name: "Contact", value: "contact" },
        { id: 6, name: "Address", value: "address" },
        { id: 7, name: "Date", value: "date" },
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

//SEARCH TENANTS INPUTS
export const searchTenantInput = (filter) => {
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

//SEARCH INPUTS
export const searchInput = (filter) => {
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