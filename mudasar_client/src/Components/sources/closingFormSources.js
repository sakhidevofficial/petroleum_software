import { DOMAIN } from "../../backend/API";

//ADD Product GROUP FORM FIELDS
export const productsClosingForm = (products) => {
    return [
        {
            id: 1,
            label: "Select Product",
            type: "select",
            name: "productId",
            options:
            products.length > 0 &&
            products.map((item) =>
                // Here we are setup the filter operator items
                {
                    return { id: item._id, name: item.name, value: item._id, avatarUrl: `${DOMAIN}/public/products/images/${item.pic}`, avatarAlt: "./img/avatarfile.png" };
                }
                ),
            grid: {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 12,
            },
        },
        {
            id: 2,
            label: "Select Machine",
            type: "select",
            name: "groupStatus",
            size: "small",
            minWidth: "100wh",
            options: [
                { id: 1, name: "Active", value: true },
                { id: 2, name: "De-Active", value: false }
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
            label: "Enter Reading",
            type: "number",
            name: "groupDescription",
            grid: {
                xs: 12,
                sm: 6,
                md: 6,
                lg: 6
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
