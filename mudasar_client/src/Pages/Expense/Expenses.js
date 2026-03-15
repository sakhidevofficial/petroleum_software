import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { FileUpload } from "../../backend/uploadFile";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {
  AddShoppingCartTwoTone,
  AssignmentInd,
  SwitchAccount,
} from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";
import { addMachine, deleteMachine, getMachines, getSingleMachine, updateMachine } from "../../redux/machineSlice/machineSlice";
import { machineInputFields, searchMachineFilters } from "../../Components/sources/machinesFormSources";
import { searchInput } from "../../Components/sources/formSources";
import { expenseColumns } from "../../Components/datatable/expenseTableSources";
import { addExpense, clearExpenses, deleteExpense, getExpenses, getSingleExpense, updateExpense } from "../../redux/expenseSlice/expenseSlice";
import { expenseInputFields, searchExpenseFilters } from "../../Components/sources/expensesFormSources";
import AuthContext from "../../context/auth/AuthContext";

const Expense = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Call Auth Context & Extract Logout
  const { user } = useContext(AuthContext);

  //Initializing useSelector to get data from redux store
  const expenses = useSelector((state) => state.expenses.data);
  //Initializing the current machine
  const currentData = useSelector((state) => state.expenses.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.expenses.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.expenses.errors);
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
    name: "",
    description: "",
    amount: "",
    date: ""
  });

  //Round values function
  const handleValuesRound = (num) => {
    return Math.round(num * 100) / 100;
  }

  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Expense API Hit
  useEffect(() => {
    if ((selectedRowId !== undefined && openFormDialog === true) || (selectedRowId !== undefined && openDetailsDialog === true)) {
      //Dispatch current expense
      dispatch(getSingleExpense(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when currentCustomer is updated
      setState({
        name: currentData.name,
        description: currentData.description,
        amount: currentData.amount,
        date: currentData.date
      });
    }
  }, [currentData]);

  //useEffect to dispatch all machines
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getMachines using dispatch

    dispatch(getExpenses(initialData));

    //Call clear expenses to clear expenses from state on unmount
    return () => {
      dispatch(clearExpenses());
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

  //Handle Delete Expense func
  const handleOnDelete = () => {
    //Calling delete function
    dispatch(deleteExpense(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getExpenses using dispatch
    dispatch(getExpenses(initialData));
  };
  //Handle On submit For search
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
        dispatch(getExpenses(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getExpenses(newState));
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
        dispatch(getExpenses(newState));
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
      name: "",
      description: "",
      amount: "",
      date: ""
    });
  };

  console.log(state)
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
        dispatch(getExpenses(newState));
      }
    } else if (field === "") {
      dispatch(getExpenses(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getExpenses(newState));
      }
    }
  };
  // Function for Capitalizing the data
  function capitalizeEachWord(sentence) {
    return sentence
      .split(" ")
      .map((word, i) => {
        return i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
      })
      .join(" ");
  }
  //Iterate and capitalizing data of each row
  const capitalizedRows = expenses.map((row) => ({
    ...row,
    name: row.name && capitalizeEachWord(row.name),
    description: row.description && capitalizeEachWord(row.description)
  }));
  //Destructure values from the state
  const { name, description, amount, date } = state;
  //Handle on submit function
  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    if (name === "") {
      toast("Enter expense name", { position: "top-right", type: "error" });
    } else if (description === "") {
      toast("Enter description", { position: "top-right", type: "error" });
    } else if (amount === "") {
      toast("Enter amount expend", { position: "top-right", type: "error" });
    } else if (date === "") {
      toast("Select date please", { position: "top-right", type: "error" });
    } else {

      let newObj = { ...state, amount: handleValuesRound(amount) }
      if (selectedRowId !== null) {
        const data = {
          id: selectedRowId[0],
          Data: newObj,
        };
        //Hit API Call using dispatch to updated expense
        dispatch(updateExpense(data));

      } else {
        let newObj = { ...state, amount: handleValuesRound(amount) }
        //Hit API Call using dispatch to add Expense
        dispatch(addExpense(newObj));
        
      }

    }
  };

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Employee Page  */}
      <Header
        icon={<AddShoppingCartTwoTone style={{ marginRight: "10px" }} />}
        title="Expenses"
        subTitle="Manage Expenses"
        addBtnTitle="Add Expense"
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
              ? "UPDATE EXPENSE"
              : "ADD EXPENSE"
          }
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={expenseInputFields(selectedRowId, currentData)}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />
        {/* Employee Details Dialog box  */}
        <DetailsDialog
          openDetailsDialog={openDetailsDialog}
          heading={"Kashif's Detail"}
          inputs={Object.keys(currentData).length !== 0 && currentData}
          icon={<AssignmentInd style={{ marginRight: "10px" }} />}
        />
        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading={"DELETE EXPENSE"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={
            "Are sure you want to delete Expense?."
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
          searchFiltersForm={searchExpenseFilters}
          searchInputForm={searchInput}
        />
        {/* DataTable for Employees  */}
        <DataTable
          columns={expenseColumns(
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

export default Expense;
