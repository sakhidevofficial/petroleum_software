//Add new meter Reading form fields
export const meterInputFields = [
    {
      id: 1,
      label: "New Reading",
      type: "number",
      name: "reading",
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }
    },
    {
      id: 2,
      label: "Cash Sales (Amount)",
      type: "number",
      name: "salesCash",
      grid: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }
    },
    {
      id: 3,
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
        id: 4,
        label: "Add Reading",
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