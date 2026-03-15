import "./customer.scss";
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { AssignmentInd, AttachMoney, SwitchAccount } from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";

import { searchCustomerInput } from "../../Components/sources/customersFormSources";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";
import { searchCustomerPaymentFilters } from "../../Components/sources/customerPaymentsFormSources";
import AuthContext from "../../context/auth/AuthContext";
import { customerAdvanceInputFields } from "../../Components/sources/customerAdvancesFormSources";
import { customerAdvanceColumns } from "../../Components/datatable/customerAdvanceTableSources";
import {
  addCustomerAdvance,
  clearCurrentCustomerAdvance,
  clearCustomerAdvance,
  deleteCustomerAdvance,
  getCustomerAdvances,
  getSingleCustomerAdvance,
  updateCustomerAdvance,
} from "../../redux/customerAdvanceSlice/customerAdvanceSlice";
import {
  clearAllActiveCustomers,
  getAllActiveCustomers,
} from "../../redux/completeDataSlice/completeDataSlice";

const CustomerAdvance = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Use Auth Context get user
  const { user } = useContext(AuthContext);
  //Initializing useSelector to get data from redux store
  const customers = useSelector((state) => state.completeData.customers);
  const customerAdvances = useSelector((state) => state.customerAdvances.data);
  //Initializing the current customer
  const currentCustomer = useSelector(
    (state) => state.customerAdvances.current
  );
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector(
    (state) => state.customerAdvances.totalRecord
  );
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.customerAdvances.errors);
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
    startDate: "",
    endDate: "",
  });

  //Setup state for values
  const [state, setState] = useState({
    cashierId: user.id,
    customerId: "",
    amount: "",
    description: "",
    date: "",
  });

  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Customer API Hit
  useEffect(() => {
    if (
      (selectedRowId !== undefined && openFormDialog === true) ||
      (selectedRowId !== undefined && openDetailsDialog === true)
    ) {
      //Dispatch current customer
      dispatch(getSingleCustomerAdvance(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentCustomer).length !== 0) {
      // Set the state when currentCustomer is updated
      setState({
        customerId: currentCustomer.customerId,
        description: currentCustomer.description,
        amount: currentCustomer.amount,
        date: currentCustomer.date,
      });
    }
  }, [currentCustomer]);

  // Fetch customers and customer advances on component mount
  useEffect(() => {
    // Initial query parameters
    const initialQuery = {
      page: 0,
      sort: filters.sort,
    };

    // Fetch customers and their advances
    dispatch(getAllActiveCustomers());
    dispatch(getCustomerAdvances(initialQuery));

    // Cleanup function to reset state when component unmounts
    return () => {
      dispatch(clearAllActiveCustomers());
      dispatch(clearCustomerAdvance()); // Clear customer advances from state
    };

    // We deliberately omit filters.sort from dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line
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
    dispatch(deleteCustomerAdvance(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getCustomers using dispatch
    dispatch(getCustomerAdvances(initialData));
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
        dispatch(getCustomerAdvances(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getCustomerAdvances(newState));
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
        dispatch(getCustomerAdvances(newState));
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
      customerId: "",
      description: "",
      amount: "",
      date: "",
    });

    dispatch(clearCurrentCustomerAdvance());
    // eslint-disable-next-line
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
        dispatch(getCustomerAdvances(newState));
      }
    } else if (field === "") {
      dispatch(getCustomerAdvances(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getCustomerAdvances(newState));
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
  const capitalizedRows = customerAdvances.map((row) => ({
    ...row,
  }));
  //Destructure values from the state
  const { userId, customerId, description, amount, date } = state;
  //Handle on submit function
  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    if (userId === "") {
      toast("Please re-login", { position: "top-right", type: "error" });
    } else if (customerId === "") {
      toast("Select Customer", { position: "top-right", type: "error" });
    } else if (description === "") {
      toast("Please enter description", {
        position: "top-right",
        type: "error",
      });
    } else if (amount === "") {
      toast("Please enter amount", { position: "top-right", type: "error" });
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
        //Hit API Call using dispatch to updated tenant
        dispatch(updateCustomerAdvance(data));
      } else {
        console.log("Check state => ", state);
        //Hit API Call using dispatch to add tenant
        dispatch(addCustomerAdvance(state));
      }
    }
  };

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Tenants Page  */}
      <Header
        icon={<AttachMoney style={{ marginRight: "10px" }} />}
        title="Customer Advances"
        subTitle="Manage Application Customers"
        // link="/customers/new"
        addBtnTitle="Add Advance"
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
            selectedRowId !== null && Object.keys(currentCustomer).length !== 0
              ? "UPDATE CUSTOMER ADVANCE"
              : "ADD CUSTOMER ADVANCE"
          }
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={customerAdvanceInputFields(
            selectedRowId,
            currentCustomer,
            customers
          )}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />
        {/* Customer Details Dialog box  */}
        {Object.keys(currentCustomer).length !== 0 && (
          <DetailsDialog
            openDetailsDialog={openDetailsDialog}
            heading={`${capitalizeEachWord(
              currentCustomer?.customerName
            )} Advance Details`}
            inputs={currentCustomer}
            handleOnCloseDetails={() => {
              setOpenDetailsDialog(false);
              setSelectedRowId(null);
              setState({
                userId: user.id,
                customerId: "",
                amount: "",
                description: "",
                date: "",
              });
              dispatch(clearCurrentCustomerAdvance());
            }}
            icon={<AssignmentInd style={{ marginRight: "10px" }} />}
          />
        )}
        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading={"DELETE CUSTOMER ADVANCE"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={"Are you sure you want to delete this advance."}
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
          searchFiltersForm={searchCustomerPaymentFilters}
          searchInputForm={searchCustomerInput}
        />
        {/* DataTable for Tenants  */}
        <DataTable
          columns={customerAdvanceColumns(
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

export default CustomerAdvance;
