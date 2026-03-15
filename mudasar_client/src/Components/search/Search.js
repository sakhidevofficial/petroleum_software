import { FilterList } from "@mui/icons-material";
import SyncIcon from "@mui/icons-material/Sync";
import { Box, IconButton, Typography } from "@mui/material";
import "./searchBar.scss";
import React from "react";
import FilterForm from "./FilterForm";
import GridForm from "../form/GridForm";


const Search = ({
  filters,
  submit,
  setFilter,
  state,
  setState,
  loadDataFunc,
  openFiltersPanel,
  setOpenFiltersPanel,
  searchFiltersForm,
  searchInputForm
}) => {
  
  //Handle open filters panel
  const handleOpenFiltersPanel = (event) => {
    event.preventDefault();
    setOpenFiltersPanel(!openFiltersPanel);
  };

  //Handle clear filters function
  const handleClearFilters = () => {
    //Clear the filters
    setFilter({ ...filters, field: "", operator: "", sort: -1 });
    //clear the input state as well
    setState({ searchInput: "", startDate: "", endDate: "" });
    //If Filters panel is open then close it
    openFiltersPanel
      ? setOpenFiltersPanel(!openFiltersPanel)
      : setOpenFiltersPanel(openFiltersPanel);
    //Reload the fetch data or normal get
    loadDataFunc();
  };
  return (
    <Box>
      {/* FILTER COMPONENTS  */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleOpenFiltersPanel}>
            <FilterList />
          </IconButton>
          <Typography>Filter</Typography>
        </Box>
        {filters.field !== "" && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleClearFilters}>
              <SyncIcon />
            </IconButton>
            <Typography>Clear Filters</Typography>
          </Box>
        )}
      </Box>
      <Box
        className={
          openFiltersPanel ? "searchArea searchAreaActive" : "searchArea"
        }
      >
        <FilterForm
          inputs={searchFiltersForm(filters)}
          filters={filters}
          setFilter={setFilter}
        />
        {/* SEARCH INPUTS  */}
        <Box>
           <GridForm
            inputs={searchInputForm(filters)}
            submit={submit}
            state={state}
            setState={setState}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Search;
