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
  Store,
  SwitchAccount,
  Widgets,
} from "@mui/icons-material";
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

  getProducts,

} from "../../redux/productSlice/productSlice";
import { purchaseColumns } from "../../Components/datatable/purchaseTableSources";
import {
  addPurchase,
  clearPurchases,
  deletePurchase,
  getPurchases,
  getSinglePurchase,
  updatePurchase,
} from "../../redux/purchaseStockSlice/purchaseStockSlice";
import { purchaseInputFields, searchPurchaseFilters } from "../../Components/sources/purchasesFormSources";
import { getSuppliers } from "../../redux/supplierSlice/supplierSlice";
import { cleardata, getAllActiveSuppliers, getAllProducts } from "../../redux/completeDataSlice/completeDataSlice";

const Purchase = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Initializing useSelector to get data from redux store
  const products = useSelector((state) => state.completeData.products);
  console.log(products)
  const purchases = useSelector((state) => state.purchases.data);
  const suppliers = useSelector((state) => state.completeData.suppliers);
  //Initializing the current employee
  const currentData = useSelector((state) => state.purchases.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.purchases.totalRecord);
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.purchases.errors);
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
    startDate: "",
    endDate: "",
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
      //Dispatch current purchase
      dispatch(getSinglePurchase(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      // Set the state when current Product is updated
      setState({
        productId: currentData.productId,
        supplierId: currentData.supplierId,
        quantity: currentData.quantity,
        costPrice: currentData.costPrice,
        sellingPrice: currentData.sellingPrice,
        paidAmount: currentData.paidAmount,
        date: currentData.date,
      });
    }
  }, [currentData]);

  //useEffect to dispatch all purchases
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getProducts using dispatch
    dispatch(getAllProducts());
    dispatch(getPurchases(initialData));
    dispatch(getAllActiveSuppliers());

    //Call clear products to clear products from state on unmount
    return () => {
      dispatch(clearPurchases());
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

  //Handle Delete Purchase stock func
  const handleOnDelete = () => {
    //Calling delete function
    dispatch(deletePurchase(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getPurchases using dispatch
    dispatch(getPurchases(initialData));
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
        dispatch(getPurchases(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getPurchases(newState));
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
        dispatch(getPurchases(newState));
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
    //Clear File loaded in file state
    setFile("");
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
        dispatch(getPurchases(newState));
      }
    } else if (field === "") {
      dispatch(getPurchases(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getPurchases(newState));
      }
    }
  };
  // Function for Capitalizing the data
  function capitalizeEachWord(sentence) {
    console.log(sentence)
    return sentence
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  //Iterate and capitalizing data of each row
  const capitalizedRows = purchases.map((row) => ({
    ...row,
    supplierName: row.supplier_name && capitalizeEachWord(row.supplier_name),
    productName: row.product_name && capitalizeEachWord(row.product_name),
    
    // status: row.status && capitalizeEachWord(row.status),
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
  const handleOnAddUpdateFormSubmit = async (e) => {
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
      if (selectedRowId !== null) {
        const data = {
          id: selectedRowId[0],
          Data: state,
        };
        //Hit API Call using dispatch to updated purchase
        dispatch(updatePurchase(data));
      } else {
        //Hit API Call using dispatch to add purchase
        dispatch(addPurchase(state));
      }
    }
  };
  
  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Products Page  */}
      <Header
        icon={<Store style={{ marginRight: "10px" }} />}
        title="Purchase History"
        subTitle="Manage Application Stocks"
        addBtnTitle="Add Stock"
        dialog={openFormDialog}
        setDialog={setOpenFormDialog}
      />
      {/* Main Card for setup employees Table */}
      <Box className="mainCard">
        {/* Add OR Update Employee Dialog Box  */}
        {products.length > 0 && suppliers.length > 0 && <FormDialog
          openFormDialog={openFormDialog}
          setOpenFormDialog={setOpenFormDialog}
          heading={
            selectedRowId !== null && Object.keys(currentData).length !== 0
              ? "UPDATE STOCK"
              : "ADD STOCK"
          }
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={purchaseInputFields(
            selectedRowId,
            currentData,
            products,
            suppliers
          )}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />}
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
          heading={"DELETE PURCHASED STOCK"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={"Are sure you want to delete Purchased Stock?."}
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
          searchFiltersForm={searchPurchaseFilters}
          searchInputForm={searchEmployeeInput}
        />
        {/* DataTable for Products  */}
        <DataTable
          columns={purchaseColumns(
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

export default Purchase;
