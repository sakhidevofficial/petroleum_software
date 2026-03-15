import { DOMAIN } from "../../backend/API";

//Add new price form fields
export const priceInputFields = (selectedRowId, currentData, products) => [
    {
      id: 1,
      label: "Product Name",
      type: "select",
      name: "productId",
      options: products.length > 0 && products.map(item => 
        // Here we are setup the filter operator items
       { return { id: item._id, name: item.name, value: item._id,  avatarUrl: `${DOMAIN}/public/products/images/${item.pic}`, avatarAlt: "./img/avatarfile.png"  } }
      ),
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }
    },
    {
      id: 2,
      label: "Cost Price",
      type: "number",
      name: "costPrice",
      grid: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6
      }
    },
    {
      id: 3,
      label: "Selling Price",
      type: "number",
      name: "sellingPrice",
      grid: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6
      }
    },
    {
      id: 4,
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
        id: 7,
        label: selectedRowId !== null && Object.keys(currentData).length !== 0 ? "Update Price":"Add New Price",
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

//SEARCH Price Filters
export const searchPriceFilters = (filter) => {
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
        { id: 1, name: "Product", value: "product" },
        { id: 2, name: "Date", value: "date" }
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