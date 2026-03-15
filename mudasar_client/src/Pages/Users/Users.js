import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import {
  userColumns,
  userRows,
} from "../../Components/datatable/userTableSources";
import { useDispatch, useSelector } from "react-redux";
import { FileUpload } from "../../backend/uploadFile";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { AssignmentInd, PeopleAlt, SwitchAccount } from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";
import {
  addCustomer,
  clearCustomers,
  deleteCustomer,
  getCustomers,
  getSingleCustomer,
  updateCustomer,
} from "../../redux/customerSlice/customerSlice";
import {
  customerInputFields,
  searchCustomerFilters,
  searchCustomerInput,
} from "../../Components/sources/customersFormSources";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";
import {
  addUser,
  clearCurrentUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../../redux/userSlice/userSlice";
import { userInputFields } from "../../Components/sources/usersFormSources";
import { DOMAIN } from "../../backend/API";

const Users = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Initializing useSelector to get data from redux store
  const users = useSelector((state) => state.users.data);

  //Initializing the current customer
  const currentData = useSelector((state) => state.users.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.users.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.users.errors);
  //Use State for Handle Open and close of form dialog
  const [openFormDialog, setOpenFormDialog] = useState(false);
  //Use State for handle Open and close of Details Dialog
  const [openDetailsDialog, setDetailsDialog] = useState(false);
  //Use State for Handle Open and close of dialog box
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  //Use State for selected row item id
  const [selectedRowId, setSelectedRowId] = useState(null);
  //Use State for manage pages
  const [currentPage, setCurrentPage] = useState(0);
  //Setup use state for search filters
  const [filters, setFilter] = useState({
    field: "",
    operator: "",
    sort: -1,
  });
  //Use State for search inputs
  const [search, setSearch] = useState({
    searchInput: "",
  });
  //Setup state for values
  const [state, setState] = useState({
    name: "",
    username: "",
    access: "",
    email: "",
    contact: "",
    access: "",
    address: "",
    password: "",
    confirmPassword: "",
    status: "",
    pic: "",
  });
  //Use State for search inputs
  const [file, setFile] = useState("");

  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Customer API Hit
  useEffect(() => {
    if (
      (selectedRowId !== undefined && openFormDialog === true) ||
      (selectedRowId !== undefined && openDetailsDialog === true)
    ) {
      //Dispatch current customer
      dispatch(getSingleUser(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when currentData is updated
      setState({
        name: currentData.name,
        email: currentData.email,
        contact: currentData.contact,
        username: currentData.username,
        access: currentData.access,
        address: currentData.address,
        status: currentData.status,
      });
      async function urlToFile(url) {
        // Fetch the file
        let response = await fetch(url);
        let data = await response.blob();
        let metadata = {
          type: "image/jpeg",
        };
        let file = new File([data], "test.jpg", metadata);
        // Return the file object
        return file;
      }

      async function loadFile() {
        const fileGenerated = await urlToFile(
          `${DOMAIN}/public/users/images/${currentData.pic}`
        );

        //Set file
        setFile(fileGenerated);
      }

      if (currentData.pic) {
        loadFile();
      }
    }
  }, [currentData]);

  //useEffect to dispatch all users
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    dispatch(getAllUsers(initialData));
  }, []);

  //useEffect to handle the dates filter
  useEffect(() => {
    if (filters.field === "date") {
      setFilter({ ...filters, operator: "inBetween" });
    } else {
      if (filters.operator === "inBetween") {
        setFilter({ ...filters, operator: "$regex" });
      }
    }
    // eslint-disable-next-line
  }, [filters.field]);

  //useEffect to Iterate submit Errors
  useEffect(() => {
    if (submitErrors?.length > 0) {
      //iterate submit errors
      submitErrors.forEach((item) => {
        toast(item.msg, { position: "top-right", type: "error" });
      });
    } else {
      handleOnFormDialogClose();
    }
  }, [submitErrors]);

  //Handle Delete Tenant func
  const handleOnDelete = () => {
    //Calling delete function
    dispatch(deleteCustomer(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getCustomers using dispatch
    dispatch(getAllUsers(initialData));
  };
  //Handle On submit
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    //Destructuring values from state
    const { startDate, endDate, searchInput } = search;
    //Destructuring values from filters
    const { field, operator, sort } = filters;
    //Organizing data from filters and search Input
    let newState = {
      field: field === "" ? undefined : field,
      operator: operator,
      sort: sort,
      page: 0,
      searchInput: searchInput,
      startDate: endDate !== "" && startDate === "" ? endDate : startDate,
      endDate: endDate === "" && startDate !== "" ? startDate : endDate,
    };
    if (field === "date") {
      if (startDate === "" && endDate === "") {
        toast("Please Select Date", { position: "top-right", type: "error" });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getAllUsers(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getAllUsers(newState));
      //After search results close the filters panel
      setOpenFiltersPanel(!openFiltersPanel);
      //Set Page to Zero
      setCurrentPage(0);
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else if (field !== "" && searchInput !== "" && operator === "") {
        toast("Please select condition", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getAllUsers(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    }
  };

  //Handle On Form Dialog Close
  const handleOnFormDialogClose = () => {
    //Close Form Dialog
    setOpenFormDialog(false);
    //Clear selected Row Id
    setSelectedRowId(null);
    //Clear State and remove previous data
    setState({
      name: "",
      email: "",
      contact: "",
      username: "",
      access: "",
      address: "",
      status: "",
      password: "",
      confirmPassword: "",
    });
    //Clear File loaded in file state
    setFile("");

    dispatch(clearCurrentUser());
  };

  //Handle on Page Change
  const handleOnPageChange = (e) => {
    //Setting pagination
    setCurrentPage(e);
    //Destructuring values from state
    const { startDate, endDate, searchInput } = search;
    //Destructuring values from filters
    const { field, operator, sort } = filters;
    //Organizing data from filters and search Input
    let newState = {
      field: field === "" ? "" : field,
      operator: operator,
      sort: sort,
      page: e,
      searchInput: searchInput,
      startDate: endDate !== "" && startDate === "" ? endDate : startDate,
      endDate: endDate === "" && startDate !== "" ? endDate : endDate,
    };

    if (field === "date") {
      if (startDate === "" && endDate === "") {
        toast("Please Select Date", { position: "top-right", type: "error" });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getAllUsers(newState));
      }
    } else if (field === "") {
      dispatch(getAllUsers(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getAllUsers(newState));
      }
    }
  };
  // Function for Capitalizing the data
  function capitalizeEachWord(sentence) {
    return sentence
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  //Iterate and capitalizing data of each row
  const capitalizedRows = users.map((row) => ({
    ...row,
    name: row.name && capitalizeEachWord(row.name),
    address: row.address && capitalizeEachWord(row.address),
    status: row.status && capitalizeEachWord(row.status),
  }));
  //Destructure values from the state
  const { name, username, access, contact, address, password, confirmPassword, status } = state;
  //Handle on submit function
  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Check the passwrod => ", state)
    if (name === "") {
      toast("Enter Name", { position: "top-right", type: "error" });
    } else if (username === "") {
      toast("Enter unique username", { position: "top-right", type: "error" });
    } else if (access === "") {
      toast("Select User Role", { position: "top-right", type: "error" });
    } else if (contact === "") {
      toast("Enter contact number", { position: "top-right", type: "error" });
    } else if (!password || password.length < 6) {
      toast("Enter a password min 6 characters", {
        position: "top-right",
        type: "error",
      });
    } else if(!confirmPassword || confirmPassword.length < 6){
      toast("Enter confirm password", {
        position: "top-right",
        type: "error",
      });
    } else if(password !== confirmPassword){
      toast("Your passwords are not matching", {
        position: "top-right",
        type: "error",
      });
    }
    
    else if (address === "") {
      toast("Enter address of user", { position: "top-right", type: "error" });
    } else if (status === "") {
      toast("Select status", { position: "top-right", type: "error" });
    } else {
      //Check for image uploaded
      if (file !== "") {
        //Function to convert file data in form data for upload
        function getFormData(object) {
          const formData = new FormData();
          formData.append("file", object);
          return formData;
        }
        //File Upload Axios Endpoint function
        const res = await FileUpload(getFormData(file));

        if (res?.success === true) {
          //NewState variable
          const newState = { ...state };
          newState.pic = res.filename;
          //Add uploaded file name into the state
          setState(newState);
          //After uploading image file submit other fields
          if (selectedRowId !== null) {
            const data = {
              id: selectedRowId[0],
              Data: newState,
            };

            //Hit API Call using dispatch to updated customer
            dispatch(updateUser(data));
          } else {
            //Hit API Call using dispatch to add user
            dispatch(addUser(newState));
          }
        }
      } else {
        //Upload data if image not selected
        if (selectedRowId !== null) {
          const data = {
            id: selectedRowId[0],
            Data: state,
          };
          //Hit API Call using dispatch to updated tenant
          dispatch(updateUser(data));
        } else {
          //Hit API Call using dispatch to add user
          dispatch(addUser(state));
        }
      }
    }
  };

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Tenants Page  */}
      <Header
        icon={<PeopleAlt style={{ marginRight: "10px" }} />}
        title="Users"
        subTitle="Manage Application Users"
        // link="/customers/new"
        addBtnTitle="Add User"
        dialog={openFormDialog}
        setDialog={setOpenFormDialog}
      />
      {/* Main Card for setup tenants Table */}
      <Box className="mainCard">
        {/* Add OR Update Customer Dialog Box  */}
        <FormDialog
          openFormDialog={openFormDialog}
          setOpenFormDialog={setOpenFormDialog}
          heading={
            selectedRowId !== null && Object.keys(currentData).length !== 0
              ? "UPDATE USER"
              : "ADD USER"
          }
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
          file={file}
          setFile={setFile}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={userInputFields(selectedRowId, currentData)}
          icon={<PeopleAlt style={{ marginRight: "10px" }} />}
        />
        {/* Customer Details Dialog box  */}
        {Object.keys(currentData).length !== 0 && (
          <DetailsDialog
            openDetailsDialog={openDetailsDialog}
            heading={`${currentData.name}'s Detail`}
            inputs={currentData}
            handleOnCloseDetails={() => {
              setDetailsDialog(false);
              setSelectedRowId(null);
              //Clear State and remove previous data
              setState({
                name: "",
                email: "",
                contact: "",
                username: "",
                access: "",
                address: "",
                status: "",
              });
              //Clear File loaded in file state
              setFile("");

              dispatch(clearCurrentUser());
            }}
            icon={<AssignmentInd style={{ marginRight: "10px" }} />}
          />
        )}
        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading={"DELETE USER"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={
            "Are sure you want to User? Once you delete it's entire record will be deleted, and you can never get it back."
          }
        />

        {/* Here we calling Search component in which we 
        are passing Filters state and Input Values state  */}
        <Search
          submit={handleOnSubmit}
          filters={filters}
          setFilter={setFilter}
          state={search}
          setState={setSearch}
          openFiltersPanel={openFiltersPanel}
          setOpenFiltersPanel={setOpenFiltersPanel}
          loadDataFunc={loadData}
          searchFiltersForm={searchCustomerFilters}
          searchInputForm={searchCustomerInput}
        />
        {/* DataTable for Tenants  */}
        <DataTable
          columns={userColumns(
            setOpenFormDialog,
            setDetailsDialog,
            setOpenDeleteDialog
          )}
          rows={capitalizedRows}
          currentPage={currentPage}
          totalRecords={totalRecords}
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          handleOnPageChange={handleOnPageChange}
        />
      </Box>
    </Box>
  );
};

export default Users;
