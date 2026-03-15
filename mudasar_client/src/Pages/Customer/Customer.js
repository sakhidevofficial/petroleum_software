import "./customer.scss";
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// Components
import Header from "../../Components/Header/Header";
import DataTable from "../../Components/datatable/DataTable";
import Dialogue from "../../Components/dialogue/Dialogue";
import FormDialog from "../../Components/dialogue/FormDialogue";
import DetailsDialog from "../../Components/dialogue/DetailsDialogue";
import Search from "../../Components/search/Search";

// Icons
import DangerousIcon from "@mui/icons-material/Dangerous";
import { AssignmentInd, SwitchAccount } from "@mui/icons-material";

// Data Sources
import { customerColumns } from "../../Components/datatable/customerTableSources";
import {
  customerInputFields,
  searchCustomerFilters,
  searchCustomerInput,
} from "../../Components/sources/customersFormSources";

// Services
import { FileUpload } from "../../backend/uploadFile";

// Redux Actions
import {
  addCustomer,
  clearCustomers,
  deleteCustomer,
  getCustomers,
  getSingleCustomer,
  updateCustomer,
} from "../../redux/customerSlice/customerSlice";
import AuthContext from "../../context/auth/AuthContext";
import { DOMAIN } from "../../backend/API";

/**
 * Customer Management Component
 *
 * This component provides a complete interface for managing customers including:
 * - Viewing customer list
 * - Adding new customers
 * - Updating existing customers
 * - Deleting customers
 * - Searching and filtering customers
 */
const Customer = () => {
  // Redux hooks
  const dispatch = useDispatch();
  //Use Auth Context get user
  const { user } = useContext(AuthContext);
  const customers = useSelector((state) => state.customers.data);
  const currentCustomer = useSelector((state) => state.customers.current);
  const totalRecords = useSelector((state) => state.customers.totalRecord);
  const submitErrors = useSelector((state) => state.customers.errors);

  // Dialog states
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Data states
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState("");

  // Form states
  const [state, setState] = useState({
    userId: user.id,
    name: "",
    email: "",
    contact: "",
    address: "",
    balance: "",
    status: "",
    pic: "",
  });

  // Search and filter states
  const [filters, setFilter] = useState({
    field: "",
    operator: "",
    sort: -1,
  });
  const [search, setSearch] = useState({
    searchInput: "",
  });
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);

  // Responsive state
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  // ======================
  // EFFECTS
  // ======================

  // Handle window resize for responsive design
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Load initial customer data
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    dispatch(getCustomers(initialData));

    return () => {
      dispatch(clearCustomers());
    };
  }, [dispatch, filters.sort]);

  // Fetch single customer when row is selected
  useEffect(() => {
    if (selectedRowId && (openFormDialog || openDetailsDialog)) {
      dispatch(getSingleCustomer(selectedRowId));
    }
  }, [selectedRowId, openFormDialog, openDetailsDialog, dispatch]);

  // Update form state when currentCustomer changes
  useEffect(() => {
    if (Object.keys(currentCustomer).length !== 0) {
      setState({
        name: currentCustomer.name,
        email: currentCustomer.email,
        contact: currentCustomer.contact,
        balance: currentCustomer.balance,
        address: currentCustomer.address,
        status: currentCustomer.status,
      });

      // Convert image URL to File object if customer has an image
      if (currentCustomer.pic) {
        const urlToFile = async (url) => {
          const response = await fetch(url);
          const data = await response.blob();
          return new File([data], "profile.jpg", { type: "image/jpeg" });
        };

        urlToFile(
          `${DOMAIN}/public/customers/images/${currentCustomer.pic}`
        ).then(setFile);
      }
    }
  }, [currentCustomer]);

  // Handle date filter field specific logic
  useEffect(() => {
    if (filters.field === "date" && filters.operator !== "inBetween") {
      setFilter({ ...filters, operator: "inBetween" });
    } else if (filters.field !== "date" && filters.operator === "inBetween") {
      setFilter({ ...filters, operator: "$regex" });
    }
  }, [filters.field]);

  // Display submit errors if any
  useEffect(() => {
    if (submitErrors?.length > 0) {
      submitErrors.forEach((item) => {
        toast(item.msg, { position: "top-right", type: "error" });
      });
    } else {
      handleOnFormDialogClose();
    }
  }, [submitErrors]);

  // ======================
  // HANDLERS
  // ======================

  /**
   * Handle customer deletion
   */
  const handleOnDelete = () => {
    dispatch(deleteCustomer(selectedRowId));
    setSelectedRowId(null);
  };

  /**
   * Reload customer data with default parameters
   */
  const loadData = () => {
    dispatch(getCustomers({ page: 0, sort: -1 }));
  };

  /**
   * Handle search form submission
   * @param {Event} e - Form submit event
   */
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const { startDate, endDate, searchInput } = search;
    const { field, operator, sort } = filters;

    const searchParams = {
      field: field || undefined,
      operator,
      sort,
      page: 0,
      searchInput,
      startDate: endDate && !startDate ? endDate : startDate,
      endDate: endDate || startDate,
    };

    // Validate date filter
    if (field === "date" && !startDate && !endDate) {
      toast("Please Select Date", { position: "top-right", type: "error" });
      return;
    }

    // Validate search input
    if (field && !searchInput) {
      toast("Please Enter to search..", {
        position: "top-right",
        type: "error",
      });
      return;
    }

    // Validate operator
    if (field && !operator) {
      toast("Please select condition", {
        position: "top-right",
        type: "error",
      });
      return;
    }

    dispatch(getCustomers(searchParams));
    setOpenFiltersPanel(false);
    setCurrentPage(0);
  };

  /**
   * Handle pagination change
   * @param {number} page - New page number
   */
  const handleOnPageChange = (page) => {
    const { startDate, endDate, searchInput } = search;
    const { field, operator, sort } = filters;

    const searchParams = {
      field: field || undefined,
      operator,
      sort,
      page,
      searchInput,
      startDate: endDate && !startDate ? endDate : startDate,
      endDate: endDate || startDate,
    };

    dispatch(getCustomers(searchParams));
    setCurrentPage(page);
  };

  /**
   * Reset form dialog state
   */
  const handleOnFormDialogClose = () => {
    setOpenFormDialog(false);
    setSelectedRowId(null);
    setState({
        userId: user.id,
      name: "",
      email: "",
      contact: "",
      address: "",
      balance: "",
      status: "",
    });
    setFile("");
  };

  /**
   * Capitalize each word in a string
   * @param {string} sentence - Input string
   * @returns {string} Capitalized string
   */
  const capitalizeEachWord = (sentence) => {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  /**
   * Handle customer form submission (add/update)
   * @param {Event} e - Form submit event
   */
  const handleOnAddUpdateFormSubmit = async (e) => {
    e.preventDefault();
    const { name, balance, status } = state;

    // Form validation
    if (!name) {
      toast("Enter Customer name", { position: "top-right", type: "error" });
      return;
    }
    if (!balance) {
      toast("Enter initial balance", { position: "top-right", type: "error" });
      return;
    }
    if (!status) {
      toast("Please select status", { position: "top-right", type: "error" });
      return;
    }

    // Handle file upload if present
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await FileUpload(formData);

        if (res?.success) {
          const customerData = { ...state, pic: res.filename };
          await submitCustomerData(customerData);
        }
      } catch (error) {
        toast("Error uploading image", {
          position: "top-right",
          type: "error",
        });
      }
    } else {
      await submitCustomerData(state);
    }
  };

  /**
   * Submit customer data to Redux
   * @param {object} data - Customer data to submit
   */
  const submitCustomerData = async (data) => {
    if (selectedRowId) {
      dispatch(updateCustomer({ id: selectedRowId[0], Data: data }));
    } else {
      dispatch(addCustomer(data));
    }
  };

  // Capitalize data for display in table
  const capitalizedRows = customers.map((row) => ({
    ...row,
    name: row.name && capitalizeEachWord(row.name),
    address: row.address && capitalizeEachWord(row.address),
    status: row.status && capitalizeEachWord(row.status),
  }));

  return (
    <Box m="0px 20px 15px 20px">
      {/* Page Header */}
      <Header
        icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        title="Customers"
        subTitle="Manage Application Customers"
        addBtnTitle={isMobile ? "Add" : "Add Customer"}
        dialog={openFormDialog}
        setDialog={setOpenFormDialog}
      />

      {/* Main Content Card */}
      <Box className="mainCard">
        {/* Customer Form Dialog */}
        <FormDialog
          openFormDialog={openFormDialog}
          setOpenFormDialog={setOpenFormDialog}
          heading={selectedRowId ? "UPDATE CUSTOMER" : "ADD CUSTOMER"}
          color="#999999"
          state={state}
          setState={setState}
          file={file}
          setFile={setFile}
          handleOnClose={handleOnFormDialogClose}
          handleOnSubmit={handleOnAddUpdateFormSubmit}
          inputs={customerInputFields(selectedRowId, currentCustomer)}
          icon={<SwitchAccount style={{ marginRight: "10px" }} />}
        />

        {/* Customer Details Dialog */}
        {Object.keys(currentCustomer).length !== 0 && (
          <DetailsDialog
            openDetailsDialog={openDetailsDialog}
            heading={`${capitalizeEachWord(currentCustomer.name)}'s Detail`}
            inputs={currentCustomer}
            handleOnCloseDetails={() => {
              setOpenDetailsDialog(false);
              setSelectedRowId(null);
              setState({
                name: "",
                email: "",
                contact: "",
                address: "",
                balance: "",
                status: "",
              });
              setFile("");
            }}
            icon={<AssignmentInd style={{ marginRight: "10px" }} />}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          heading="DELETE CUSTOMER"
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message="Are you sure you want to delete this customer? This action cannot be undone."
        />

        {/* Search Component */}
        <Search
          submit={handleOnSubmit}
          filters={filters}
          setFilter={setFilter}
          state={search}
          setState={setSearch}
          openFiltersPanel={openFiltersPanel}
          setOpenFiltersPanel={setOpenFiltersPanel}
          loadDataFunc={loadData}
          searchFiltersForm={searchCustomerFilters}
          searchInputForm={searchCustomerInput}
        />

        {/* Customer Data Table */}
        <DataTable
          columns={customerColumns(
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

export default Customer;
