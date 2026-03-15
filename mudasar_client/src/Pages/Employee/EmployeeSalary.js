// import "./customer.scss";
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {
  AssignmentInd,
  AttachMoney,
  SwitchAccount,
} from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";
import {startOfMonth} from "date-fns"

import {
 searchCustomerInput,
} from "../../Components/sources/customersFormSources";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";
import {clearCustomerPayments, getCustomerPayments } from "../../redux/customerPaymentSlice/customerPaymentSlice";
import { searchCustomerPaymentFilters } from "../../Components/sources/customerPaymentsFormSources";
import { addSupplierPayment, deleteSupplierPayment, getSingleSupplierPayment, getSupplierPayments, updateSupplierPayment } from "../../redux/supplierPaymentSlice/supplierPaymentSlice";
import { getSuppliers } from "../../redux/supplierSlice/supplierSlice";
import { supplierPaymentInputFields } from "../../Components/sources/supplierPaymentsFormSources";
import { supplierPaymentColumns } from "../../Components/datatable/supplierPaymentTableSources";
import { addEmployeeSalary, clearEmployeePayments, clearEmployeeSalaries, deleteEmployeeSalary, getEmployeePayments, getEmployeeSalaries, updateEmployeeSalary } from "../../redux/employeeSalarySlice/employeeSalarySlice";
import { employeeSalaryColumns } from "../../Components/datatable/employeeSalaryTableSources";
import { employeeSalaryInputFields, searchEmployeeSalaryFilters } from "../../Components/sources/employeeSalaryFormSources";
import { getEmployees } from "../../redux/employeeSlice/employeeSlice";
import dayjs from "dayjs";
import { getAllEmployees } from "../../redux/completeDataSlice/completeDataSlice";
import AuthContext from "../../context/auth/AuthContext";

const EmployeeSalary = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
   //Use Auth Context get user
  const { user } = useContext(AuthContext);
  //Initializing useSelector to get data from redux store
  const allEmployees = useSelector((state) => state.completeData.employees);
  const salaries = useSelector((state) => state.salaries.data);
  //Initializing the current customer
  const currentData = useSelector((state) => state.supplierpayments.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.salaries.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.supplierpayments.errors);
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
    startDate: "",
    endDate: ""
  });
  
  //Setup state for values
  const [state, setState] = useState({
    userId: user.id,
    employeeId: "",
    salaryOfMonth: dayjs().format('MMM'),
    salaryOfYear: dayjs().format('YYYY'),
    date: ""
  });


  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Supplier API Hit
  useEffect(() => {
    if ((selectedRowId !== undefined && openFormDialog === true) || (selectedRowId !== undefined && openDetailsDialog === true) ) {
      //Dispatch current supplier
      dispatch(getSingleSupplierPayment(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when currentCustomer is updated
      setState({
        supplierId: currentData.supplierId,
        amount: currentData.amount,
        date: currentData.date
      });     
    }
  }, [currentData]);

  //useEffect to dispatch all customers
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getEmployees using dispatch
    dispatch(getAllEmployees())
    // dispatch(getSupplierPayments(initialData));
    dispatch(getEmployeeSalaries(initialData));

    //Call clear employee payments to clear employee payments from state on unmount
    return () => {
      dispatch(clearEmployeeSalaries());
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
  } else {
    handleOnFormDialogClose();
  }
}, [submitErrors]);

//Handle Delete Tenant func
const handleOnDelete = () => {
  //Calling delete function
  dispatch(deleteEmployeeSalary(selectedRowId));
  //after delete clear row id
  setSelectedRowId(null);
};

//Load The Data
const loadData = () => {
  const initialData = { page: 0, sort: -1 };
  //Call getSuppliers Payments using dispatch
  dispatch(getEmployeeSalaries(initialData));
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
      dispatch(getEmployeeSalaries(newState));
      //After search results close the filters panel
      setOpenFiltersPanel(!openFiltersPanel);
      //Set Page to Zero
      setCurrentPage(0);
    }
  } else if (field === "") {
    //Calling dispatch function to hit API Call
    dispatch(getEmployeeSalaries(newState));
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
      dispatch(getEmployeeSalaries(newState));
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
      userId: user.id,
      employeeId: "",
      salaryOfMonth: dayjs().format('MMM'),
      salaryOfYear: dayjs().format('YYYY'),
      date: ""
    });
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
      endDate: endDate === "" && startDate !== "" ? startDate : endDate,
    };

    if (field === "date") {
      if (startDate === "" && endDate === "") {
        toast("Please Select Date", { position: "top-right", type: "error" });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getEmployeeSalaries(newState));
      }
    } else if (field === "") {
      dispatch(getEmployeeSalaries(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getEmployeeSalaries(newState));
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
  const capitalizedRows = salaries.map((row) => ({
    ...row,
    name: row.employee_name && capitalizeEachWord(row.employee_name),
    remaining: 0,
    
  }));
  //Destructure values from the state
  const { userId, employeeId,  advanceDeducted, salaryOfMonth, date } = state;
  //Handle on submit function
  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    if (employeeId === "") {
      toast("Select employee first ", { position: "top-right", type: "error" });
    } else if (advanceDeducted === "") {
      toast("Please enter advance deducted or Zero", { position: "top-right", type: "error" });
    } else if (salaryOfMonth === "") {
      toast("Please select salary of month", { position: "top-right", type: "error" });
    } else if (date === "") {
      toast("Select date", { position: "top-right", type: "error" });
    } else {
      //Check for image uploaded
    
        //Upload data if image not selected
        if (selectedRowId !== null) {
          const data = {
            id: selectedRowId[0],
            Data: state,
          };
          //Hit API Call using dispatch to updated employee salary
          dispatch(updateEmployeeSalary(data));
          handleOnFormDialogClose()
        } else {
          //Hit API Call using dispatch to add employee salar
          dispatch(addEmployeeSalary(state));
          handleOnFormDialogClose()
        }
      
    }
  };
  
  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Tenants Page  */}
      <Header
        icon={<AttachMoney style={{ marginRight: "10px" }} />}
        title="Employee Salaries"
        subTitle="Manage Application Employee Salary"
        // link="/s/new"
        addBtnTitle="Add Salary"
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
              ? "UPDATE EMPLOYEE SALARY"
              : "ADD EMPLOYEE SALARY"
          }
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
        
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={employeeSalaryInputFields(selectedRowId, currentData, allEmployees)}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />
        {/* Customer Details Dialog box  */}
        {Object.keys(currentData).length !== 0 && <DetailsDialog
          openDetailsDialog={openDetailsDialog}
          heading={"Kashif's Detail"}
          inputs={currentData}
          icon={<AssignmentInd style={{ marginRight: "10px" }} />}
        />}
        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading={"DELETE EMPLOYEE SALARY"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={
            "Are you sure you want to delete this salary."
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
          searchFiltersForm={searchEmployeeSalaryFilters}
          searchInputForm={searchCustomerInput}
        />
        {/* DataTable for Employee Payments  */}
        <DataTable
          columns={employeeSalaryColumns(
            setOpenDeleteDialog,
            setDetailsDialog,
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

export default EmployeeSalary;
