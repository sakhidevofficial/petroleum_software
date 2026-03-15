// import "./customer.scss";
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
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";
import {
  addSupplierPayment,
  clearCurrentSupplierPayment,
  clearSupplierPayments,
  deleteSupplierPayment,
  getSingleSupplierPayment,
  getSupplierPayments,
  updateSupplierPayment,
} from "../../redux/supplierPaymentSlice/supplierPaymentSlice";
import { getSuppliers } from "../../redux/supplierSlice/supplierSlice";
import {
  searchSupplierPaymentFilters,
  supplierPaymentInputFields,
} from "../../Components/sources/supplierPaymentsFormSources";
import { supplierPaymentColumns } from "../../Components/datatable/supplierPaymentTableSources";
import { searchInput } from "../../Components/sources/formSources";
import { getAllActiveSuppliers } from "../../redux/completeDataSlice/completeDataSlice";
import AuthContext from "../../context/auth/AuthContext";

const SupplierPayment = () => {
  //Use Auth Context get user
  const { user } = useContext(AuthContext);
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();

  //Initializing useSelector to get data from redux store
  const suppliers = useSelector((state) => state.completeData.suppliers);

  const supplierpayments = useSelector((state) => state.supplierpayments.data);
  //Initializing the current customer
  const currentData = useSelector((state) => state.supplierpayments.current);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector(
    (state) => state.supplierpayments.totalRecord
  );
  //Initializing UseSelector to get errors
  const submitErrors = useSelector((state) => state.supplierpayments.errors);
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
    userId: user.id,
    supplierId: "",
    amount: "",
    date: "",
  });

  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //Use Effect to get Single Supplier API Hit
  useEffect(() => {
    if (
      (selectedRowId !== undefined && openFormDialog === true) ||
      (selectedRowId !== undefined && openDetailsDialog === true)
    ) {
      //Dispatch current supplier
      dispatch(getSingleSupplierPayment(selectedRowId));
    }
    // eslint-disable-next-line
  }, [selectedRowId]);

  //Load Data into state for update Use Effect (backend returns supplier_id)
  useEffect(() => {
    if (Object.keys(currentData).length !== 0) {
      setState((prev) => ({
        ...prev,
        supplierId: currentData.supplier_id ?? currentData.supplierId ?? "",
        amount: currentData.amount ?? "",
        date: currentData.date ?? "",
      }));
    }
  }, [currentData]);

  // Show toast when add/update fails
  useEffect(() => {
    if (submitErrors?.length > 0) {
      const msg = typeof submitErrors[0] === "string" ? submitErrors[0] : submitErrors[0]?.msg;
      if (msg) toast(msg, { position: "top-right", type: "error" });
    }
  }, [submitErrors]);

  //useEffect to dispatch all customers
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getSuppliers using dispatch
    dispatch(getAllActiveSuppliers());
    dispatch(getSupplierPayments(initialData));

    //Call clear customers to clear customers from state on unmount
    return () => {
      dispatch(clearSupplierPayments());
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
    dispatch(deleteSupplierPayment(selectedRowId));
    //after delete clear row id
    setSelectedRowId(null);
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getSuppliers Payments using dispatch
    dispatch(getSupplierPayments(initialData));
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
        dispatch(getSupplierPayments(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getSupplierPayments(newState));
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
        console.log("New State => ", newState);
        //Calling dispatch function to hit API Call
        dispatch(getSupplierPayments(newState));
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
      supplierId: "",
      amount: "",
      date: "",
    });

    dispatch(clearCurrentSupplierPayment());
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
        dispatch(getSupplierPayments(newState));
      }
    } else if (field === "") {
      dispatch(getSupplierPayments(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getSupplierPayments(newState));
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
  const capitalizedRows = supplierpayments.map((row) => ({
    ...row,
    name: row.supplier_name && capitalizeEachWord(row.supplier_name),
    remaining: row.rem_amount ? row.rem_amount : 0,
  }));
  //Destructure values from the state
  const { userId, supplierId, amount, date } = state;
  // Resolve supplier id: use numeric id, or match typed text to supplier name/company. Always return a number >= 1 or null.
  const resolveSupplierId = () => {
    const rawId = state.supplierId;
    const numId = Number(rawId);
    if (Number.isInteger(numId) && numId >= 1) return numId;
    if (rawId == null || String(rawId).trim() === "" || !Array.isArray(suppliers) || suppliers.length === 0) return null;
    const search = String(rawId).trim().toLowerCase();
    const exact = suppliers.find(
      (s) =>
        (s.name && s.name.trim().toLowerCase() === search) ||
        (s.company_name && String(s.company_name || "").trim().toLowerCase() === search)
    );
    if (exact) {
      const id = exact.id ?? exact._id;
      const n = id != null ? parseInt(id, 10) : NaN;
      return Number.isInteger(n) && n >= 1 ? n : null;
    }
    const partial = suppliers.find(
      (s) =>
        (s.name && s.name.toLowerCase().includes(search)) ||
        (s.company_name && String(s.company_name || "").toLowerCase().includes(search))
    );
    if (!partial) return null;
    const id = partial.id ?? partial._id;
    const n = id != null ? parseInt(id, 10) : NaN;
    return Number.isInteger(n) && n >= 1 ? n : null;
  };

  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    const effectiveSupplierId = resolveSupplierId();
    let supplierValue = null;
    if (effectiveSupplierId != null && effectiveSupplierId >= 1) {
      supplierValue = Number(effectiveSupplierId);
    } else {
      const raw = state.supplierId;
      if (raw != null && raw !== "") {
        if (typeof raw === "object" && (raw.value != null || raw.name != null)) {
          const v = raw.value ?? raw.name ?? raw.id;
          supplierValue = typeof v === "number" && v >= 1 ? v : (typeof v === "string" && v.trim() ? v.trim() : null);
        } else {
          const s = String(raw).trim();
          supplierValue = s !== "" ? s : null;
        }
      }
    }
    if (userId === "") {
      toast("Please re-login ", { position: "top-right", type: "error" });
    } else if (supplierValue == null) {
      toast("Please select a supplier from the list", { position: "top-right", type: "error" });
    } else if (amount === "" || amount == null) {
      toast("Please enter amount", { position: "top-right", type: "error" });
    } else if (date === "" || date == null) {
      toast("Select date", { position: "top-right", type: "error" });
    } else {
      if (selectedRowId !== null) {
        const data = {
          id: selectedRowId[0],
          Data: state,
        };
        dispatch(updateSupplierPayment(data));
      } else {
        const amountNum = Number(state.amount);
        const payload = {
          userId: state.userId,
          supplierId: supplierValue,
          ...(typeof supplierValue === "string" && supplierValue !== "" && { supplierName: supplierValue }),
          amount: Number.isFinite(amountNum) ? amountNum : state.amount,
          date: state.date,
        };
        dispatch(addSupplierPayment(payload));
        loadData();
      }
    }
  };

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Tenants Page  */}
      <Header
        icon={<AttachMoney style={{ marginRight: "10px" }} />}
        title="Supplier Payments"
        subTitle="Manage Application Supplier Payments"
        // link="/customers/new"
        addBtnTitle="Add Supplier Payment"
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
              ? "UPDATE SUPPLIER PAYMENT"
              : "ADD SUPPLIER PAYMENT"
          }
          color="#999999"
          state={state}
          Id={selectedRowId}
          setState={setState}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={supplierPaymentInputFields(
            selectedRowId,
            currentData,
            suppliers
          )}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />
        
        {/* Customer Details Dialog box  */}
        {Object.keys(currentData).length !== 0 && (
          <DetailsDialog
            openDetailsDialog={openDetailsDialog}
            heading={`${capitalizeEachWord(currentData.name)}'s Detail`}
            inputs={currentData}
            handleOnCloseDetails={() => {
              setOpenDetailsDialog(false);
              setSelectedRowId(null);
              setState({
                userId: user.id,
                supplierId: "",
                pevAmount: "",
                amount: "",
                remAmount: "",
                date: "",
                status: "",
              });
              dispatch(clearCurrentSupplierPayment());
            }}
            icon={<AssignmentInd style={{ marginRight: "10px" }} />}
          />
        )}
        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading={"DELETE SUPPLIER PAYMENT"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={"Are you sure you want to delete this payment."}
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
          searchFiltersForm={searchSupplierPaymentFilters}
          searchInputForm={searchInput}
        />
        {/* DataTable for Tenants  */}
        <DataTable
          columns={supplierPaymentColumns(
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

export default SupplierPayment;
