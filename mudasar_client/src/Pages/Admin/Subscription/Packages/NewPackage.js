import React, {useState, useEffect} from 'react'
import { Box, Grid } from "@mui/material";
import GridForm from "../../../../Components/form/GridForm";
import Header from "../../../../Components/Header/Header";
import PlanCard from "../../../../Components/card/PlanCard"
import setAlert from '../../../../redux/alertSlice/setAlert';
import "./style.scss";
import { packageFeatureForm, packageGroupForm, packagesInputFields } from "../../../../Components/sources/formSources";
import {addPackages, clearPackages, getSinglePackage, updatePackage} from "../../../../redux/webAdmin/packagesSlice/packageSlice"
import { useDispatch, useSelector } from 'react-redux';
import { FileUpload } from '../../../../backend/uploadFile';
import { clearFeatures, getFeatures } from '../../../../redux/webAdmin/featuresSlice/featureSlice';
import { v4 as uuid } from "uuid";
import Card from '../../../../Components/card/Card';
import { useParams } from 'react-router-dom';
import { DOMAIN } from '../../../../backend/API';

const NewPackage = () => {
  
   //Initialize use Dispatch to use Package Slice and get Features
   const dispatch = useDispatch()
  //Initializing useSelector to get all features
  const features = useSelector(state => state.features)
  //Initializing useSelector to get Current Package for update
  const get_package = useSelector(state => state.packages.current)
 

 
  //Initializing useParams Hook
  const {id} = useParams()
 
  useEffect(()=>{
    //if Package id is not undefined Check if current package is not empty
    if(id !== undefined && Object.keys(get_package).length !== 0 ){
      //Set Current Package in state for update
      setState({...get_package})
    } else {
      //Set State to empty
      setState({
        name: "",
        description: "",
        price: "",
        expiresInMonths: "",
        group: [],
        features: [],
        color: "",
        image: "",
        status: ""
      });
    }
    // eslint-disable-next-line
  },[get_package])
  //Use Effect to load all features from the store
  useEffect(()=> {
    if(id !== undefined){
      dispatch(getSinglePackage(id))
    }
    //Calling get features function from dispatch
    dispatch(getFeatures())
   
    //Calling unmount function to clear the store on unmount
    return () => {
      dispatch(clearFeatures())
      dispatch(clearPackages())
    }
   // eslint-disable-next-line
  },[id])
  

   // State for input values
   const [state, setState] = useState({
    name: "",
    description: "",
    price: "",
    expiresInMonths: "",
    group: [],
    features: [],
    color: "",
    image: "",
    status: ""
   });

   const u_id = uuid;
   //State for groups input values
   const [group, setGroup] = useState({
    id: u_id(),
    groupTitle: "",
    groupDescription: "",
    groupStatus: ""
   })

   //For Select option values
   const [feature, setFeature] = useState({
    selectgroup: "",
    selectfeature: "",
  });
   //State for file Input
   const [file, setFile] = useState("");
   //Handle Add Group btn function 
   const handleGroupBtnFunc = (e) => {
    e.preventDefault()
    if(group.groupTitle === ""){
      setAlert("Please enter group name", "error")
    }else if(group.groupDescription === ""){
      setAlert("Please enter group description", "error")
    }else if(group.groupStatus === ""){
      setAlert("Please select group status", "error")
    }
    else {
      state.group.push(group)
      setAlert("Group Added successfully", "success")
      setGroup({id: u_id(), groupTitle: "", groupDescription: "", groupStatus: ""})
    }
   }
   //Handle Add Feature btn function
   const handleAddFeatureBtn = (e) => {
      e.preventDefault()
      if(feature.selectgroup === ""){
        setAlert("Please select group", "error")
      }else if(feature.selectfeature === ""){
        setAlert("Please select feature", "error")
      }else {
        const addfeature = {id: feature.selectfeature, group: feature.selectgroup}
        state.features.push(addfeature)
        setAlert("Feature added successfully", "success")
        setFeature({selectgroup: "", selectfeature: "",})
      }
   }
  //Handle Delete Feature from Groups
  const handleFeatureDelete = (id) => {
    const features = state.features.filter(item => item.id !== id)
    setState({...state, features: features })
  }
  //Handle Delete Group and related Features
  const handleGroupDelete = (id) => {
    const groups = state.group.filter(item => item.id !== id)
    const features = state.features.filter(item => item.group !== id)
    setState({...state, features: features, group: groups})
  }
  //Creating handle on submit function
  const handleOnSubmit = (e) => {
    e.preventDefault() // to avoid default function of submit
    const {name, description, price, expiresInMonths, group, features, status } = state

    if(name === ""){
      setAlert("Please enter package name", "error")
    } else if(description === ""){
      setAlert("Please enter package description", "error")
    } else if(price === ""){
      setAlert("Please enter package price", "error")
    } else if( expiresInMonths === ""){
      setAlert("Please enter total months for expiration", "error")
    } else if(group.length === 0){
      setAlert("Please add features group", "error")
    } else if(features.length === 0){
      setAlert("Add features in group", "error")
    }
    else if( status === ""){
      setAlert("Please select status for package", "error")
    } else {

      handleAddorUpdate()
    }
   }
  //Handle Add or Update 
  const handleAddorUpdate = async () =>{

    //Function to convert file data in form data for upload
    function getFormData(object) {
      const formData = new FormData();
      formData.append("file", object)
      return formData;
    }
     //File Upload Axios Endpoint function
     const res = await FileUpload(getFormData(file))

     if(res?.success === true) {
      
         //NewState variable
         const newState = {...state}
         newState.image = res.filename
         //Add uploaded file name into the state
         setState(newState)
         
         const request = async () => {
          //After uploading image file submit other fields
            if(id !== undefined){
              const data = {
                id: id,
                Data: newState
              }
              return  dispatch(updatePackage(data))
            } else {

              return  dispatch(addPackages(newState))
            }
         }
          //Calling add Packages from Redux Package Slice
          const resp =  await request()
          if(resp.payload.success === true) {
           
           setAlert(resp.payload.msg, "success")
           //After successfully added package clear the state
           if(id === undefined){
           
              setState({
                name: "",
                description: "",
                price: "",
                expiresInMonths: "",
                group: [],
                features: [],
                color: "",
                image: "",
                status: ""
              });
            }
           //After successfully added package clear the file state
           setFile("")
         } else {
           setAlert(resp.payload.msg, "error")
         }
       } else if(res.success === false) {
         setAlert(res.msg, "error")
       }
  }
  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for packages page */}
      <Header
        title="PACKAGES"
        subTitle="Managing Application Packages"
        link="/packages/new"
      />
      <Box className="mainCard">
      <Grid container spacing={2}> 
        <Grid item xs={12} sm={4}>
            <PlanCard style={{marginTop: "10px"}} title={state?.name} color={state?.color} price={state?.price} feature={state?.group} image={file ? URL.createObjectURL(file) : state?.image ? `${DOMAIN}/public/packages/images/${state.image}`: "/img/file_upload.png"}/>
            <Card heading={"Features"} deleteGroup={handleGroupDelete} deleteFeature={handleFeatureDelete} groups={state?.group} features={state?.features} dbfeatures={features}/>
        </Grid>
        <Grid item xs={12} sm={8}>
            {/* Add new Package Group Form  */}
            <GridForm formTitle={`${id === undefined ? "Add Package Group Form" : "Update Package Group Form"}`} submit={handleGroupBtnFunc} inputs={packageGroupForm()} state={group} setState={setGroup}/>
            {/* Add new Package Feature in Group Form  */}
            <GridForm formTitle={`${id === undefined ? "Add Package Feature Form" : "Update Package Feature Form"}`} submit={handleAddFeatureBtn} state={feature} setState={setFeature} inputs={packageFeatureForm(features, state.group)} />
            {/* Add new Packages Form */}
            <GridForm 
            formTitle={`${id === undefined ? "Add Package Form" : "Update Package Form"}`}
            inputs={packagesInputFields(id === undefined ? "Add Package" : "Update Package")} 
            file={file} setFile={setFile} 
            state={state} setState={setState} 
            submit={handleOnSubmit} />

        </Grid>
      
      </Grid>
       
      </Box>
    </Box>
   
  )
}

export default NewPackage