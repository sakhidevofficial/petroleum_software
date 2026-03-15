import { DOMAIN } from "../../backend/API";

//Add new Employee Salary form fields
export const employeeAdvanceInputFields = (selectedRowId, currentData, employees) => [
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
     label: "Description",
     tabIndex: 1,
     type: "text",
     name: "description",
     grid: {
       xs: 12,
       sm: 6,
       md: 6,
       lg: 6,
     },
   },
   {
     id: 3,
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
     id: 4,
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
     id: 5,
     label:
       selectedRowId !== null && Object.keys(currentData).length !== 0
         ? "Update Employee Advance"
         : "ADD Employee Advance",
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




