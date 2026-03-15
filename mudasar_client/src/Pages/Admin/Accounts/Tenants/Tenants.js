import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../../../Components/Header/Header";
import DataTable from "../../../../Components/datatable/DataTable";
import { tenantsColumns } from "../../../../Components/datatable/dataTableSources";
import { useDispatch, useSelector } from "react-redux";
import { 
  clearTenants,
  deleteTenant,
  getTenants,
} from "../../../../redux/webAdmin/tenantSlice/tenantSlice";
import Dialogue from "../../../../Components/dialogue/Dialogue";
import DangerousIcon from "@mui/icons-material/Dangerous";
import {Business} from "@mui/icons-material";
import Search from "../../../../Components/search/Search";
import { toast } from "react-toastify";
import { searchTenantFilters, searchTenantInput } from "../../../../Components/sources/formSources";

const Tenants = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Initializing useSelector to get data from redux store
  const tenants = useSelector((state) => state.tenants.data);
  //Initiaizing useSelector to get total records
  const totalRecords = useSelector((state) => state.tenants.totalRecord);
  //Use State for Handle Open and close of dialog box
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  //Use State for selected row item id
  const [selectedRowId, setSelectedRowId] = useState(null);
  //Use state for confirm Input for delete
  const [confirmInput, setConfirmInput] = useState("");
  //Use State for manage pages
  const [currentPage, setCurrentPage] = useState(0);
  //Setup use state for search filters
  const [filters, setFilter] = useState({
    field: "",
    operator: "",
    sort: -1,
  });
  //Use State for search inputs
  const [state, setState] = useState({
    searchInput: "",
    startDate: "",
    endDate: "",
  });
  //Use State for manage filters panel
  const [openFiltersPanel, setOpenFiltersPanel] = useState(false);
  //useEffect to dispatch all tenants
  useEffect(() => {
    const initialData = { page: 0, sort: filters.sort };
    //Call getTenants using dispatch
    dispatch(getTenants(initialData));

    //Call clear tenants to clear tenants from state on unmount
    return () => {
      dispatch(clearTenants());
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
  //Handle Delete Tenant func
  const handleOnDelete = () => {
    //Getting email from data results to confirm for delete
    const tenant = tenants.filter((item) => item.id === selectedRowId[0]);
    //Iterate items
    tenant.forEach((element) => {
      //Verify Confirm Input with backend data
      if (confirmInput === element.email) {
        dispatch(deleteTenant(selectedRowId));
      } else {
        toast("Email not matches", {
          position: "top-right",
          type: "warning",
        });
      }
    });
  };

  //Load The Data
  const loadData = () => {
    const initialData = { page: 0, sort: -1 };
    //Call getTenants using dispatch
    dispatch(getTenants(initialData));
  };
  //Handle On submit
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    //Destructuring values from state
    const { startDate, endDate, searchInput } = state;
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
        dispatch(getTenants(newState));
        //After search results close the filters panel
        setOpenFiltersPanel(!openFiltersPanel);
        //Set Page to Zero
        setCurrentPage(0);
      }
    } else if (field === "") {
      //Calling dispatch function to hit API Call
      dispatch(getTenants(newState));
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
      } else if(field !== "" && searchInput !== "" && operator === ""){
        toast("Please select condition", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getTenants(newState));
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
    const { startDate, endDate, searchInput } = state;
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
      endDate: endDate === "" && startDate !== "" ? endDate : endDate,
    };

    if (field === "date") {
      if (startDate === "" && endDate === "") {
        toast("Please Select Date", { position: "top-right", type: "error" });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getTenants(newState));
      }
    } else if (field === "") {
      dispatch(getTenants(newState));
    } else {
      if (field !== "" && searchInput === "") {
        toast("Please Enter to search..", {
          position: "top-right",
          type: "error",
        });
      } else {
        //Calling dispatch function to hit API Call
        dispatch(getTenants(newState));
      }
    }
  };

  // Function for Capitalizing the data
  function capitalizeEachWord(sentence) {
    return sentence.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }
  //Iterate and capitalizing data of each row
  const capitalizedTenantsRows = tenants.map(row => ({
    ...row,
     ownerName: row.ownerName && capitalizeEachWord(row.ownerName),
     username: row.username && capitalizeEachWord(row.username),
     tenantName: row.tenantName && capitalizeEachWord(row.tenantName),
     address: row.address && capitalizeEachWord(row.address)
  }
  ));

  console.log(capitalizedTenantsRows)
  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for Tenants Page  */}
      <Header
        icon={<Business style={{marginRight: "10px"}}/>}
        title="Tenants"
        subTitle="Manage Application Tenants"
        link="/tenants/new"
      />
      {/* Main Card for setup tenants Table */}
      <Box className="mainCard">
        {/* Delete Content Dialog box  */}
        <Dialogue
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleOnDelete={handleOnDelete}
          confirmInput={confirmInput}
          setConfirmInput={setConfirmInput}
          heading={"DELETE TENANT"}
          color="#ff0000"
          icon={<DangerousIcon style={{ marginRight: "10px" }} />}
          message={
            "Are sure you want to delete Tenant? Once you delete it's entire record will be deleted, and you can never get it back."
          }
        />
        {/* Here we calling Search component in which we 
          are passing Filters state and Input Values state  */}
        <Search
          submit={handleOnSubmit}
          filters={filters}
          setFilter={setFilter}
          state={state}
          setState={setState}
          openFiltersPanel={openFiltersPanel}
          setOpenFiltersPanel={setOpenFiltersPanel}
          loadDataFunc={loadData}
          searchFiltersForm={searchTenantFilters}
          searchInputForm={searchTenantInput}
        />
        {/* DataTable for Tenants  */}
        <DataTable
          columns={tenantsColumns(setOpenDeleteDialog)}
          rows={capitalizedTenantsRows}
          currentPage={currentPage}
          totalRecords={totalRecords}
          setSelectedRowId={setSelectedRowId}
          handleOnPageChange={handleOnPageChange}
        />
      </Box>
    </Box>
  );
};

export default Tenants;
