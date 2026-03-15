import { Box } from "@mui/material";
import { featureColumns, featureRows } from "../../../Components/datatable/dataTableSources";
import DataTable from "../../../Components/datatable/DataTable";
import Form from "../../../Components/form/Form";
import Header from "../../../Components/Header/Header";
import "./style.scss";
import { featureInputFields } from "../../../Components/sources/formSources";
import AlertContext from '../../../context/alert/AlertContext';
import { useState, useContext, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux"
import { addFeature, clearFeatures, deleteFeature, getFeatures } from "../../../redux/webAdmin/featuresSlice/featureSlice";

export default function Features() {
  //Initialization of Redux Disptach
  const dispatch = useDispatch()
  //Initializing useSelector hook to get data from redux store
  const features = useSelector(state => state.features)
   //Initialization of Auth Context and Alert Context
   const alertContext = useContext(AlertContext);
   // Destructing of set Alert function using useContext hook
   const { setAlert } = alertContext;
  //Create State for holding the form values 
  const [state, setState] = useState("")
  //Destructuring values from state
  const {name, description, status} = state
  //Use Effect to load all features from store
  useEffect(()=> {
    //Calling getFeatures function from dispatch
    dispatch(getFeatures())
    //Calling unmount function to clear the store on unmount
    return ()=> {
      dispatch(clearFeatures())
    }
  }, [])
  //function for handle delete feature
  const handleDelete = async (id) => {
    const res = await dispatch(deleteFeature(id))
    if(res.payload.success == true){
      setAlert(res.payload.msg, "success")
    }
  }
  //Create Handle on form submit function
  const handleOnSubmit = async (e) => {
    e.preventDefault()

    if(name == ""){
      setAlert("Please enter name", "error")
    }else if(description == ""){
      setAlert("Please enter description", "error")
    }else if(status == ""){
      setAlert("Please select status", "error")
    } else {
      const res = await dispatch(addFeature(state))
      if(res.payload?.success == true){
        setAlert(res.payload.msg, "success")
        setState("")
      }
    }
    
  }
  return (
    <Box m="0px 20px 20px 20px">
      {/* Header for features page */}
      <Header
        title="FEATURES"
        subTitle="Managing Application Features"
        link="/features"
      />
      <Box className="mainCard">
        {/* Add new Feature Form */}
        <Form inputs={featureInputFields} state={state} setState={setState} submitBtn={"Add Feature"} submit={handleOnSubmit}/>
        {/* Data Table of Features */}
        <DataTable columns={featureColumns} rows={features} deleteItem={handleDelete} />
      </Box>
    </Box>
  );
}
