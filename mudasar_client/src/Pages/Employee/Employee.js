import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { FileUpload } from "../../backend/uploadFile";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { AssignmentInd, SwitchAccount } from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";

import { employeeColumns } from "../../Components/datatable/employeeTableSources";
import {
  addEmployee,
  clearCurrentEmplyee,
  clearEmployees,
  deleteEmplyee,
  getEmployees,
  getSingleEmployee,
  updateEmployee,
} from "../../redux/employeeSlice/employeeSlice";
import {
  employeeInputFields,
  searchEmployeeFilters,
  searchEmployeeInput,
} from "../../Components/sources/employeesFormSources";
import { DOMAIN } from "../../backend/API";

const Employee = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Initializing useSelector to get data from redux store
  const employees = useSelector((state) => state.employees.data);
  //Initializing the current employee
  const currentData = useSelector((state) => state.employees.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.employees.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.employees.errors);
  //Use State for Handle Open and close of form dialog
  const [openFormDialog, setOpenFormDialog] = useState(false);
  //Use State for handle Open and close of Details Dialog
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
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
    email: "",
    contact: "",
    designation: "",
    address: "",
    salary: "",
    advance: "",
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
      //Dispatch current supplier
      dispatch(getSingleEmployee(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when currentCustomer is updated
      setState({
        name: currentData.name,
        email: currentData.email,
        contact: currentData.contact,
        designation: currentData.designation,
        salary: currentData.salary,
        address: currentData.address,
        advance: currentData.advance,
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
          `${DOMAIN}/public/employees/images/${currentData.pic}`
        );

        //Set file
        setFile(fileGenerated);
      }

      if (currentData.pic) {
        loadFile();
      }
    }
  }, [currentData]);

  //useEffect to dispatch all employees
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getEmployees using dispatch
    dispatch(getEmployees(initialData));

    //Call clear employees to clear employees from state on unmount
    return () => {
      dispatch(clearEmployees());
    };
    //eslint-disable-next-line
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
    } 
  }, [submitErrors]);

  //Handle Delete Tenant func
  const handleOnDelete = () => {
    //Calling delete function
    dispatch(deleteEmplyee(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getEmployeess using dispatch
    dispatch(getEmployees(initialData));
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
        dispatch(getEmployees(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getEmployees(newState));
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
        dispatch(getEmployees(newState));
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
      designation: "",
      address: "",
      advance: "",
      salary: "",
      status: "",
      pic: "",
    });
    //Clear File loaded in file state
    setFile("");

    dispatch(clearCurrentEmplyee());
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
        dispatch(getEmployees(newState));
      }
    } else if (field === "") {
      dispatch(getEmployees(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getEmployees(newState));
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
  const capitalizedRows = employees.map((row) => ({
    ...row,
    name: row.name && capitalizeEachWord(row.name),
    designation: row.designation && capitalizeEachWord(row.designation),
    address: row.address && capitalizeEachWord(row.address),
    status: row.status && capitalizeEachWord(row.status),
  }));
  //Destructure values from the state
  const { name, salary, status, designation } = state;
  //Handle on submit function
  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    if (name === "") {
      toast("Enter employee name", { position: "top-right", type: "error" });
    } else if (salary === "") {
      toast("Enter employee salary", { position: "top-right", type: "error" });
    } else if (salary <= 0) {
      toast("Enter a valid salary", { position: "top-right", type: "error" });
    } else if (designation === "") {
      toast("Enter employee designation", {
        position: "top-right",
        type: "error",
      });
    } else if (status === "") {
      toast("Please select status", { position: "top-right", type: "error" });
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

            //Hit API Call using dispatch to updated employee
            dispatch(updateEmployee(data));
            handleOnFormDialogClose();
          } else {
            //Hit API Call using dispatch to add Employee
            dispatch(addEmployee(newState));
            handleOnFormDialogClose();
          }
        }
      } else {
        //Upload data if image not selected
        if (selectedRowId !== null) {
          const data = {
            id: selectedRowId[0],
            Data: state,
          };
          //Hit API Call using dispatch to updated employee
          dispatch(updateEmployee(data));
          handleOnFormDialogClose();
        } else {
          //Hit API Call using dispatch to add Employee
          dispatch(addEmployee(state));
          handleOnFormDialogClose();
        }
      }
    }
  };

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Employee Page  */}
      <Header
        icon={<AssignmentInd style={{ marginRight: "10px" }} />}
        title="Employees"
        subTitle="Manage Application Employees"
        addBtnTitle="Add Employee"
        dialog={openFormDialog}
        setDialog={setOpenFormDialog}
      />
      {/* Main Card for setup employees Table */}
      <Box className="mainCard">
        {/* Add OR Update Employee Dialog Box  */}
        <FormDialog
          openFormDialog={openFormDialog}
          setOpenFormDialog={setOpenFormDialog}
          heading={
            selectedRowId !== null && Object.keys(currentData).length !== 0
              ? "UPDATE EMPLOYEE"
              : "ADD EMPLOYEE"
          }
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
          file={file}
          setFile={setFile}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={employeeInputFields(selectedRowId, currentData)}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />
        {/* Employee Details Dialog box  */}
        <DetailsDialog
          openDetailsDialog={openDetailsDialog}
          heading={`${
            Object.keys(currentData).length !== 0 && currentData.name
          }'s Detail`}
          inputs={Object.keys(currentData).length !== 0 && currentData}
          icon={<AssignmentInd style={{ marginRight: "10px" }} />}
          handleOnCloseDetails={() => {
            setOpenDetailsDialog(false);
            setSelectedRowId(null);
            setState({
              name: "",
              email: "",
              contact: "",
              designation: "",
              address: "",
              salary: "",
              advance: "",
              status: "",
              pic: "",
            });
            dispatch(clearCurrentEmplyee());
          }}
        />
        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading={"DELETE Employee"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={"Are sure you want to delete Employee?."}
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
          searchFiltersForm={searchEmployeeFilters}
          searchInputForm={searchEmployeeInput}
        />
        {/* DataTable for Employees  */}
        <DataTable
          columns={employeeColumns(
            setOpenDeleteDialog,
            setOpenDetailsDialog,
            setOpenFormDialog
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

export default Employee;
