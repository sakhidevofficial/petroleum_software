
import { Link } from "react-router-dom";
import { Delete, Edit, Info, Style } from "@mui/icons-material";
import { IconButton, Chip } from "@mui/material";
import { DOMAIN } from "../../backend/API";



// SAMPLE DATA FOR USERS
//Export User Columns
export const userColumns = (setOpenFormDialog, setDetailsDialog, setOpenDeleteDialog ) => [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img src={
              params.row.pic
                ? `${DOMAIN}/public/users/images/${params.row.pic}`
                : "./img/avatarfile.png"
            }
            alt=""
            className="cellImg"/>
          {params.row.name}
        </div>
      );
    },
  },
  { field: "email", headerName: "Email", width: 230 },
  { field: "contact", headerName: "Contact", width: 150 },
  { field: "access", headerName: "Role", width: 120 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <IconButton
            className="viewButton"
            onClick={() => {
              setOpenFormDialog(true)
            }}
          >
            <Edit style={{ fontSize: "20px" }} />
          </IconButton>

          <IconButton className="viewButton" onClick={()=>setDetailsDialog(true)}>
            <Info style={{ fontSize: "20px" }} />
          </IconButton>

          <IconButton
            className="viewButton"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Delete style={{ fontSize: "20px" }} />
          </IconButton>
        </div>
      );
    },
  },
];

//Export User Rows
export const userRows = [
  {
    id: 1,
    username: "snow",
    img: "img/profilepic.jpg",
    status: "active",
    email: "1snow@gmail.com",
    age: 35,
  },
  {
    id: 2,
    username: "Jamie Lannister",
    img: "img/profilepic.jpg",
    status: "passive",
    email: "2snow@gmail.com",
    age: 42,
  },
  {
    id: 3,
    username: "Lannister",
    img: "img/profilepic.jpg",
    status: "pending",
    email: "3snow@gmail.com",
    age: 45,
  },
  {
    id: 4,
    username: "snow",
    img: "img/profilepic.jpg",
    status: "active",
    email: "1snow@gmail.com",
    age: 35,
  },
  {
    id: 5,
    username: "Jamie Lannister",
    img: "img/profilepic.jpg",
    status: "passive",
    email: "2snow@gmail.com",
    age: 42,
  },
  {
    id: 6,
    username: "Lannister",
    img: "img/profilepic.jpg",
    status: "pending",
    email: "3snow@gmail.com",
    age: 45,
  },
];

// DATA TABLE FORMATE FOR FEATURES
//Export User Columns
export const featureColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "feature",
    headerName: "Feature Name",
    width: 250,
  },
  { field: "description", headerName: "Description", width: 250 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];



export const featureRows = [
  {
    id: 1,
    feature: "Blackberry",
    description: "Read, Add, Update, Delete",
    status: "active",
  },
  {
    id: 2,
    feature: "Orange",
    description: "Read, Add, Update, Delete",
    status: "active",
  },
  {
    id: 3,
    feature: "Cherry",
    description: "Read, Add, Update, Delete",
    status: "active",
  },
];

// DATA TABLE FORMATE FOR PACKAGES
//Export PACKAGES Columns
export const packagesColumns = (deleteItem) => [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Plan",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img src={params.row.image} alt="" className="cellImg" />
          {params.row.name}
        </div>
      );
    },
  },
  { field: "price", headerName: "Price", width: 70 },
  {
    field: "features",
    headerName: "Features",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellAction features" >
          <Chip label="Features" size="small" />
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Link to={`/packages/update/${params.row.id}`}  style={{ textDecoration: "none" }}>
            <IconButton className="viewButton">
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Link>

          <IconButton onClick={() => deleteItem(params.row.id)}>
            <Delete style={{ fontSize: "20px" }} />
          </IconButton>
        </div>
      );
    },
  },
];

//DATA TABLE FORMATE FOR TENANTS
//Export TENANTS Columns
export const tenantsColumns = (setOpenDeleteDialog) =>[
  // { field: "_id", headerName: "ID", width: 70,  sortable: false,
  // },
  {
    field: "ownerName",
    headerName: "Owner Name",
    sortable: false,
    width: 200,

    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img src={params.row.logo ? `${DOMAIN}/public/tenants/images/${params.row.logo}`:"./img/avatarfile.png"} alt="" className="cellImg" />
          {params.row.ownerName}
        </div>
      );
    },
  },
  // { field: "username", headerName: "Username", width: 200 },
  { field: "email", headerName: "Email", width: 200, sortable: false, },
  { field: "tenantName", headerName: "Company Name", width: 200,  sortable: false, },
  { field: "contact", headerName: "Contact", width: 200,  sortable: false, },
  { field: "address", headerName: "Address", width: 200,  sortable: false, },
  {
    field: "action",
    headerName: "Action",
    sortable: false,
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Link to={`/tenants/update/${params.row.id}`}  style={{ textDecoration: "none" }}>
            <IconButton className="viewButton">
              <Edit style={{ fontSize: "20px" }} />
            </IconButton>
          </Link>

          <IconButton onClick={() => setOpenDeleteDialog(true)}>
            <Delete style={{ fontSize: "20px" }} />
          </IconButton>
        </div>
      );
    },
  },
]
export const tenantsRows = [
  {
    id: 1,
    name: "Kashif Hussain",
    image: "img/blackberry.png",
    email: "kashif@gmail.com",
    tenantName: "Saimon Technologies",
    contact: "0302-2365926",
    address: "Qaim colony Naushahro feroze"
  },
  {
    id: 2,
    name: "Kashif Hussain",
    image: "img/blackberry.png",
    // username: "kashif",
    email: "kashif@gmail.com",
    tenantName: "Saimon Technologies",
    contact: "0302-2365926",
    address: "Qaim colony Naushahro feroze"
  }

];
// DATA TABLE FORMATE FOR PACKAGES
//Export PACKAGES Columns
export const subColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "plan",
    headerName: "Plan",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img src={params.row.image} alt="" className="cellImg" />
          {params.row.plan}
        </div>
      );
    },
  },
  { field: "price", headerName: "Price", width: 70 },
  {
    field: "features",
    headerName: "Features",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellAction features" >
          <Chip label="Features" size="small" />
        </div>
      );
    },
  },
  // { field: "features", headerName: "Features", width: 150 },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

export const subRows = [
  {
    id: 1,
    plan: "Blackberry",
    img: "img/blackberry.png",
    price: "$5",
    features: "Read, Add, Update, Delete",
    status: "active",
  },
  {
    id: 2,
    plan: "Orange",
    price: "$10",
    img: "img/orange.png",
    status: "active",
  },
  {
    id: 3,
    plan: "Cherry",
    price: "$15",
    img: "img/cherry3.jpg",
    status: "active",
  },
];
