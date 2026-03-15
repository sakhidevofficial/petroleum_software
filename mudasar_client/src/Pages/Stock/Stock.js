import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { FileUpload } from "../../backend/uploadFile";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {
  AssignmentInd,
  LocalGasStation,
  Opacity,
  SwitchAccount,
} from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";

import {
  clearMachines,
  deleteMachine,
  getMachines,
  getSingleMachine,
} from "../../redux/machineSlice/machineSlice";
import { searchMachineFilters } from "../../Components/sources/machinesFormSources";
import { searchInput } from "../../Components/sources/formSources";
import { stocksColumns } from "../../Components/datatable/stocksTableSources";
import { getStocks } from "../../redux/stockSlice/stockSlice";
import { purchaseInputFields } from "../../Components/sources/purchasesFormSources";
import { getSuppliers } from "../../redux/supplierSlice/supplierSlice";
import { addPurchase } from "../../redux/purchaseStockSlice/purchaseStockSlice";
import { getAllActiveSuppliers, getAllProducts } from "../../redux/completeDataSlice/completeDataSlice";

const Stock = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Initializing useSelector to get data from redux store
  const stocks = useSelector((state) => state.stocks.data);
  const products = useSelector((state) => state.completeData.products);
  const suppliers = useSelector((state) => state.completeData.suppliers);
  //Initializing the current machine
  const currentData = useSelector((state) => state.machines.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.stocks.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.stocks.errors);
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
    productId: "",
    supplierId: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    paidAmount: "",
    date: "",
  });

  console.log("Check State => ", state);

  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Customer API Hit
  useEffect(() => {
    if (
      (selectedRowId !== undefined && openFormDialog === true) ||
      (selectedRowId !== undefined && openDetailsDialog === true)
    ) {
      //Dispatch current supplier
      dispatch(getSingleMachine(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

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
    dispatch(getStocks(initialData));
    dispatch(getAllProducts());
    dispatch(getAllActiveSuppliers());

    //Call clear machines to clear machines from state on unmount
    return () => {
      dispatch(clearMachines());
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

  //Handle Delete Machine func
  const handleOnDelete = () => {
    //Calling delete function
    dispatch(deleteMachine(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getMachines using dispatch
    dispatch(getStocks(initialData));
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
        dispatch(getStocks(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getStocks(newState));
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
        dispatch(getStocks(newState));
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
      productId: "",
      supplierId: "",
      quantity: "",
      costPrice: "",
      sellingPrice: "",
      paidAmount: "",
      date: "",
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
        dispatch(getStocks(newState));
      }
    } else if (field === "") {
      dispatch(getStocks(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getStocks(newState));
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
  const capitalizedRows = stocks.map((row) => ({
    ...row,
  }));
  //Destructure values from the state
  const {
    productId,
    supplierId,
    quantity,
    costPrice,
    sellingPrice,
    paidAmount,
    date,
  } = state;
  //Handle on submit function
  const handleOnAddFormSubmit = async (e) => {
    e.preventDefault();
    if (productId === "") {
      toast("Select product", { position: "top-right", type: "error" });
    } else if (supplierId === "") {
      toast("Select product supplier", {
        position: "top-right",
        type: "error",
      });
    } else if (quantity === "") {
      toast("Enter quantity of product", {
        position: "top-right",
        type: "error",
      });
    } else if (costPrice === "") {
      toast("Enter cost price", { position: "top-right", type: "error" });
    } else if (sellingPrice === "") {
      toast("Enter selling price", { position: "top-right", type: "error" });
    } else if (paidAmount === "") {
      toast("Enter amount paid", { position: "top-right", type: "error" });
    } else if (date === "") {
      toast("Select date ", { position: "top-right", type: "error" });
    } else {
      //Hit API Call using dispatch to add Machine
      dispatch(addPurchase(state));
      //Clear the state
      setState({
        productId: "",
        supplierId: "",
        quantity: "",
        costPrice: "",
        sellingPrice: "",
        paidAmount: "",
        date: "",
      });
    }
  };

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Employee Page  */}
      <Header
        icon={<Opacity style={{ marginRight: "10px" }} />}
        title="Stocks"
        subTitle="Manage Application Stocks"
        addBtnTitle="Add Stock"
        dialog={openFormDialog}
        setDialog={setOpenFormDialog}
      />
      {/* Main Card for setup employees Table */}
      <Box className="mainCard">
        {/* Add OR Update Employee Dialog Box  */}
        <FormDialog
          openFormDialog={openFormDialog}
          setOpenFormDialog={setOpenFormDialog}
          heading={"ADD STOCK"}
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddFormSubmit}
          inputs={purchaseInputFields(
            selectedRowId,
            currentData,
            products,
            suppliers
          )}
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
          heading={"DELETE MACHINE"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={"Are sure you want to delete Machine?."}
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
          searchFiltersForm={searchMachineFilters}
          searchInputForm={searchInput}
        />
        {/* DataTable for Employees  */}
        <DataTable
          columns={stocksColumns(
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

export default Stock;
