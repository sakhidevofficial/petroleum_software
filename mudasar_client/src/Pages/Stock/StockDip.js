import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {
  Assessment,
  AssignmentInd,

} from "@mui/icons-material";
import Search from "../../Components/search/Search";
import { toast } from "react-toastify";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";

import { searchEmployeeInput } from "../../Components/sources/employeesFormSources";
import {  getProducts } from "../../redux/productSlice/productSlice";


import { searchWastageFilters} from "../../Components/sources/wastagesFormSources";
import { dipColumns } from "../../Components/datatable/dipTableSources";
import { addDip, clearDips, deleteDip, getDips, getSingleDip, updateDip } from "../../redux/dipSlice/dipSlice";
import { dipInputFields } from "../../Components/sources/dipsFormSources";
import AuthContext from "../../context/auth/AuthContext";
import { petrolDipChart } from "../../Components/sources/petrolDipChart";
import { cleardata, getAllProducts } from "../../redux/completeDataSlice/completeDataSlice";
import { dieselDipChart } from "../../Components/sources/dieselDipChart";

const StockDip = () => {
   //Call Auth Context & Extract Logout
  const { user } = useContext(AuthContext);
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Initializing useSelector to get data from redux store
  const products = useSelector((state) => state.completeData.products);
  const dips = useSelector((state) => state.dips.data);
  //Initializing the current employee
  const currentData = useSelector((state) => state.dips.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.dips.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.dips.errors);
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
   productId: "",
   dip: "",
   date: ""
  });
  
   //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Product API Hit
  useEffect(() => {
    if ((selectedRowId !== undefined && openFormDialog === true) || (selectedRowId !== undefined && openDetailsDialog === true) ) {
      //Dispatch current wastage
      dispatch(getSingleDip(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when current Product is updated
      setState({
        productId: currentData.productId,
        dip: currentData.dip,
        date: currentData.date
      });
    }
  }, [currentData]);

  //useEffect to dispatch all employees
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getProducts using dispatch
    dispatch(getAllProducts());
    dispatch(getDips(initialData));

    //Call clear products to clear products from state on unmount
    return () => {
      dispatch(clearDips());
      dispatch(cleardata())
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
  dispatch(deleteDip(selectedRowId));
  //after delete clear row id
  setSelectedRowId(null);
};

//Load The Data
const loadData = () => {
  const initialData = { page: 0, sort: -1 };
  //Call getWastages using dispatch
  dispatch(getDips(initialData));
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
      dispatch(getDips(newState));
      //After search results close the filters panel
      setOpenFiltersPanel(!openFiltersPanel);
      //Set Page to Zero
      setCurrentPage(0);
    }
  } else if (field === "") {
    //Calling dispatch function to hit API Call
    dispatch(getDips(newState));
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
      dispatch(getDips(newState));
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
        ...state,
        productId: "",
        dip: "",
        date: ""
    });
  };

   //Dip litres calculations
  const calculateLitres = (value, chart) => {
    const dipValue = parseFloat(value);
    if (isNaN(dipValue)) return 0;

    const sorted = [...chart].sort((a, b) => a.dip - b.dip);

    const floor = sorted.filter((d) => d.dip <= dipValue).pop();
    const ceiling = sorted.find((d) => d.dip >= dipValue);

    if (!floor || !ceiling) return 0;

    if (floor.dip === ceiling.dip) {
      return floor.litres.toFixed(2);
    }

    const dipDiff = ceiling.dip - floor.dip;
    const litresDiff = ceiling.litres - floor.litres;
    const litresPerDip = litresDiff / dipDiff;

    const extraDip = dipValue - floor.dip;
    const finalLitres = floor.litres + extraDip * litresPerDip;

    return finalLitres.toFixed(2);
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
        dispatch(getDips(newState));
      }
    } else if (field === "") {
      dispatch(getDips(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getDips(newState));
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
  const capitalizedRows = dips.map((row) => {
    const productName = row.product_name || "";
    const prevDip = row.prev_dip;
    const isPetrol = productName.toLowerCase() === "petrol";
    const chart = isPetrol ? petrolDipChart : dieselDipChart;
    return {
      ...row,
      productName: productName && capitalizeEachWord(productName),
      prevStock: prevDip ? calculateLitres(prevDip, chart) : "",
      stock: row.dip ? calculateLitres(row.dip, chart) : "",
      dipDiff: prevDip && row.dip ? (parseFloat(row.dip) - parseFloat(prevDip)) : "",
      stockDiff: prevDip && row.dip
        ? (parseFloat(calculateLitres(row.dip, chart)) - parseFloat(calculateLitres(prevDip, chart)))
        : ""
    };
  });
  //Destructure values from the state
  const { userId, productId, dip,  date} = state;
  //Handle on submit function
  console.log("CHECK DIP STATE => ", state)
  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    if (productId === "") {
      toast("Select product please", { position: "top-right", type: "error" });  
    } else if (dip === "") {
      toast("Enter wastage quantity", { position: "top-right", type: "error" });
    } else if (dip < 0) {
      toast("Quantity can not be negative", { position: "top-right", type: "error" });
    } else if (date === "") {
      toast("Select date please", { position: "top-right", type: "error" });
    } 
    else {
   
        //Upload data 
        if (selectedRowId !== null) {
          const data = {
            id: selectedRowId[0],
            Data: state,
          };
          //Hit API Call using dispatch to updated dip
          dispatch(updateDip(data));
        } else {
          //Hit API Call using dispatch to add dip
          dispatch(addDip(state));
        }
      
    }
  };
  
  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Dips Page  */}
      <Header
        icon={<Assessment style={{ marginRight: "10px" }} />}
        title="Dips Record"
        subTitle="Manage Stock Dips"
        addBtnTitle="Add Dip"
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
              ? "UPDATE DIP"
              : "ADD DIP"
          }
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={dipInputFields(selectedRowId, currentData, products)}
          icon={<Assessment style={{ marginRight: "10px" }} />}
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
          heading={"DELETE DIP READING"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={
            "Are sure you want to delete Dip Reading?."
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
          searchFiltersForm={searchWastageFilters}
          searchInputForm={searchEmployeeInput}
        />
        {/* DataTable for Dips  */}
        <DataTable
          columns={dipColumns(
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

export default StockDip;
