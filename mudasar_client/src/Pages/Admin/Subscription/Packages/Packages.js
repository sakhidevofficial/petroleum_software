import React, { useEffect } from 'react'
import { Box } from "@mui/material";
import setAlert from '../../../../redux/alertSlice/setAlert';
import { packagesColumns } from "../../../../Components/datatable/dataTableSources";
import DataTable from "../../../../Components/datatable/DataTable";
import Header from "../../../../Components/Header/Header";
import { useDispatch, useSelector } from 'react-redux';
import { deletePackage, getPackages, clearPackages } from '../../../../redux/webAdmin/packagesSlice/packageSlice';
import "./style.scss";



const Packages = () => {

  //Initializing dispatch hook to call get Packages function 
  // OR hit get packages API call
  const dispatch = useDispatch()
   //Initializing useSelector hook to get data
   const packages = useSelector(state => state.packages.data)
  //Use Effect To load all Packages into table
  useEffect(()=>{
    //Calling Dispatch function to Get All Packages
    dispatch(getPackages())
   //Calling unmount function to clear store state
    return ()=> {
      dispatch(clearPackages())
    } 
    //eslint-disable-next-line
  },[])
 //Function for handle delete package
 const handleDelete = async (id) => {
  const res = await dispatch(deletePackage(id))
  if(res.payload.success === true){
    setAlert(res.payload.msg, "error")
  }
};

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for features page */}
      <Header
        title="PACKAGES"
        subTitle="Manage Application Packages"
        link="/packages/new"
      />
      <Box className="mainCard">
        
        {/* Data Table of Features */}
        <DataTable columns={packagesColumns(handleDelete)} rows={packages} /> 
      </Box>
    </Box>
  )
}

export default Packages