import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Dialogue from "../../Components/dialogue/Dialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { Assessment, PendingActions } from "@mui/icons-material";
// import "./sales.scss";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";
import { getMachines } from "../../redux/machineSlice/machineSlice";
import { searchInput } from "../../Components/sources/formSources";
import { salesColumns } from "../../Components/datatable/salesTableSources";
import {
  clearSales,
  deleteSale,
  getSales,
  getSingleSale,
} from "../../redux/saleSlice/saleSlice";
import SaleDetails from "../Customer/SaleDetails";
import { searchSalesFilters } from "../../Components/sources/salesFormSources";
import { salesClosingsColumns } from "../../Components/datatable/salesClosingsTableSources";
import {
  clearClosings,
  deleteClosing,
  getPrintClosingReport,
  getSaleClosings,
} from "../../redux/closingsSlice/closingsSlice";
import AuthContext from "../../context/auth/AuthContext";

const TotalSaleClosings = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Call Auth Context & Extract Logout
  const { user } = useContext(AuthContext);
  //Initializing useSelector to get data from redux store
  const closings = useSelector((state) => state.closings.data);
  //Initializing the current machine
  const currentData = useSelector((state) => state.sales.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.closings.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.sales.errors);
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
    endDate: "",
  });
  //Setup state for values
  const [state, setState] = useState({
    name: "",
    type: "",
    initialReading: "",
    currentReading: "",
    status: "",
  });

  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Customer API Hit
  useEffect(() => {
    if (
      (selectedRowId !== undefined && openFormDialog === true) ||
      (selectedRowId !== undefined && openDetailsDialog === true)
    ) {
      //Dispatch current supplier
      dispatch(getSingleSale(selectedRowId[0]));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  console.log("Checking the search State ", search);
  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when currentCustomer is updated
      setState({
        name: currentData.name,
        type: currentData.type,
        initialReading: currentData.initialReading,
        currentReading: currentData.currentReading,
        status: currentData.status,
      });
    }
  }, [currentData]);

  //useEffect to dispatch all machines
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getMachines using dispatch
    // dispatch(getMachines(initialData));
    dispatch(getSaleClosings(initialData));

    //Call clear machines to clear machines from state on unmount
    return () => {
      dispatch(clearClosings());
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
    // else {
    //   // handleOnFormDialogClose();
    // }
  }, [submitErrors]);

  //Handle Delete Sale func
  const handleOnDelete = () => {
    //Calling delete function
    dispatch(deleteClosing(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Handle Print Sale func
  const handlePrint = (id) => {
    dispatch(getPrintClosingReport(id));
    console.log("Check print id => ", id);
  };
  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getMachines using dispatch
    dispatch(getSales(initialData));
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
        dispatch(getSales(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getSales(newState));
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
        dispatch(getSales(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    }
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
        dispatch(getSales(newState));
      }
    } else if (field === "") {
      dispatch(getSales(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getSales(newState));
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

  function calculateTotalAndDiscount(items) {
    let totalAmount = 0;
    let totalDiscount = 0;

    items?.forEach((item) => {
      totalAmount += item.quantity * item.price.newSellingPrice;
      totalDiscount +=
        (item.price.newSellingPrice / 100) * item.discount * item.quantity;
    });

    return { totalAmount, totalDiscount };
  }
  //Iterate and capitalizing data of each row
  const capitalizedRows =
    closings.length > 0
      ? closings.map((row) => ({
          ...row,
          totalAmount:
            row.items && calculateTotalAndDiscount(row.items).totalAmount,
          totalDiscount:
            row.items && calculateTotalAndDiscount(row.items).totalDiscount,
          product: row.items,
        }))
      : [];

  const handleOnCloseDetails = () => {
    setDetailsDialog(false);
  };

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Closings Page  */}
      <Header
        icon={<PendingActions style={{ marginRight: "10px" }} />}
        title="Shift Closings"
        subTitle="Manage Application Sale Closings"
      />
      {/* Main Card for setup shift closing Table */}
      <Box className="mainCard">
        {/* Add OR Update Shift Dialog Box  */}

        {/* Employee Details Dialog box  */}
        <SaleDetails
          openDetailsDialog={openDetailsDialog}
          heading={
            Object.keys(currentData).length !== 0
              ? `Sales Detail of ${currentData.customer.name}`
              : "Sale Details"
          }
          inputs={Object.keys(currentData).length !== 0 && currentData}
          icon={<Assessment style={{ marginRight: "10px" }} />}
          handleOnCloseDetails={handleOnCloseDetails}
        />
        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading={"DELETE SALE"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={"Are sure you want to delete Sale?."}
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
          searchFiltersForm={searchSalesFilters}
          searchInputForm={searchInput}
        />
        {/* DataTable for Employees  */}
        <DataTable
          columns={salesClosingsColumns(
            setOpenDeleteDialog,
            setDetailsDialog,
            handlePrint,
            user
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

export default TotalSaleClosings;
