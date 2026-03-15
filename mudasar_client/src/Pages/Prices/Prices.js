import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { FileUpload } from "../../backend/uploadFile";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { AssignmentInd, PriceChange, Widgets } from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";
import { productColumns } from "../../Components/datatable/productTableSources";
import {
  addEmployee,
  getEmployees,
  updateEmployee,
} from "../../redux/employeeSlice/employeeSlice";
import {
  searchEmployeeFilters,
  searchEmployeeInput,
} from "../../Components/sources/employeesFormSources";
import { productInputFields } from "../../Components/sources/productsFormSources";
import {
  addProduct,
  clearProducts,
  deleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../../redux/productSlice/productSlice";
import {
  priceInputFields,
  searchPriceFilters,
} from "../../Components/sources/pricesFormSources";
import { priceColumns } from "../../Components/datatable/priceTableSources";
import {
  addPrice,
  clearCurrentPrice,
  clearPrices,
  deletePrice,
  getPrices,
  getSinglePrice,
} from "../../redux/priceSlice/priceSlice";
import { getAllProducts } from "../../redux/completeDataSlice/completeDataSlice";

const Prices = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Initializing useSelector to get data from redux store
  const products = useSelector((state) => state.completeData.products);
  const prices = useSelector((state) => state.prices.data);
  //Initializing the current employee
  const currentData = useSelector((state) => state.prices.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.prices.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.prices.errors);
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
    productId: "",
    costPrice: "",
    sellingPrice: "",
    date: "",
  });

  //Use State for search inputs
  const [file, setFile] = useState("");

  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Product API Hit
  useEffect(() => {
    if (
      (selectedRowId !== undefined && openFormDialog === true) ||
      (selectedRowId !== undefined && openDetailsDialog === true)
    ) {

     
      //Dispatch current product
      dispatch(getSinglePrice(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when current Product is updated
      setState({
        name: currentData?.product_name,
        type: currentData?.product_type,
        costPrice: currentData.cost_price,
        sellingPrice: currentData.new_selling_price,
        date: currentData.date,
        status: currentData?.product_status,
      });
    }
  }, [currentData]);

  //useEffect to dispatch all employees
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getProducts using dispatch
    dispatch(getAllProducts());
    dispatch(getPrices(initialData));

    //Call clear products to clear products from state on unmount
    return () => {
      dispatch(clearPrices());
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

  //Handle Delete Product func
  const handleOnDelete = () => {
    //Calling delete function
    dispatch(deletePrice(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getProducts using dispatch
    dispatch(getPrices(initialData));
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
        dispatch(getPrices(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getPrices(newState));
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
        dispatch(getPrices(newState));
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
    setDetailsDialog(false)
    //Clear State and remove previous data
    setState({
      productId: "",
      costPrice: "",
      sellingPrice: "",
      date: "",
    });
    //Clear File loaded in file state
    setFile("");

    
    dispatch(clearCurrentPrice())
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
        dispatch(getPrices(newState));
      }
    } else if (field === "") {
      dispatch(getPrices(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getPrices(newState));
      }
    }
  };
  // Function for Capitalizing the data
  function capitalizeEachWord(sentence) {
    return sentence
      .split(" ")
      .map((word, i) => {
        return i === 0
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word.toLowerCase();
      })
      .join(" ");
  }
  //Iterate and capitalizing data of each row
  const capitalizedRows = prices.map((row) => ({
    ...row,
  }));
  //Destructure values from the state
  const { productId, date, costPrice, sellingPrice } = state;
  //Handle on submit function
  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    if (productId === "") {
      toast("Select product", { position: "top-right", type: "error" });
    } else if (costPrice === "") {
      toast("Enter cost price", { position: "top-right", type: "error" });
    } else if (costPrice < 0) {
      toast("Cost Price can not be negative", {
        position: "top-right",
        type: "error",
      });
    } else if (sellingPrice === "") {
      toast("Enter selling price", { position: "top-right", type: "error" });
    } else if (sellingPrice < 0) {
      toast("Selling Price can not be negative", {
        position: "top-right",
        type: "error",
      });
    } else if (date === "") {
      toast("Select date", { position: "top-right", type: "error" });
    } else {
      //Hit API Call using dispatch to add New Price
      dispatch(addPrice(state));
    }
  };
 

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Products Page  */}
      <Header
        icon={<PriceChange style={{ marginRight: "10px" }} />}
        title="Prices"
        subTitle="Manage Application Products Prices"
        addBtnTitle="Add Price"
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
              ? "UPDATE PRICE"
              : "ADD PRICE"
          }
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={priceInputFields(selectedRowId, currentData, products)}
          icon={<Widgets style={{ marginRight: "10px" }} />}
        />
        {/* Employee Details Dialog box  */}
       {Object.entries(currentData).length > 0 &&  <DetailsDialog
          openDetailsDialog={openDetailsDialog}
          heading={`${currentData?.product_name}'s Detail`}
          inputs={currentData}
          icon={<AssignmentInd style={{ marginRight: "10px" }} />}
          handleOnCloseDetails={handleOnFormDialogClose}
        />}
        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading={"REVISE PRICE BY DELETE"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={"Are sure you want to delete price entry it will revise prices?."}
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
          searchFiltersForm={searchPriceFilters}
          searchInputForm={searchEmployeeInput}
        />
        {/* DataTable for Products  */}
        <DataTable
          columns={priceColumns(
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

export default Prices;
