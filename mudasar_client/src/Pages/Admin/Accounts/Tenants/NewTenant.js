import React, { useEffect, useState } from "react";
import Header from "../../../../Components/Header/Header";
import GridForm from "../../../../Components/form/GridForm";
import { Box } from "@mui/material";
import { tenantForm } from "../../../../Components/sources/formSources";
import { useSelector, useDispatch } from "react-redux";
import { FileUpload } from "../../../../backend/uploadFile";
import { toast } from "react-toastify";
import "./style.scss";
import {
  addTenant,
  getSingleTenant,
  getTenantPackages,
  updateTenant,
} from "../../../../redux/webAdmin/tenantSlice/tenantSlice";
import { useParams } from "react-router-dom";
import Avatar from "react-avatar";
import AvatarInput from "../../../../Components/form/AvatarInput";
import { DOMAIN } from "../../../../backend/API";

const NewTenant = () => {
  //Initializing dispatch function to call redux functions
  const dispatch = useDispatch();
  //Use selector to get packages from redux store
  const packages = useSelector((state) => state.tenants.packages);
  //Use selector to get Current Tenant
  const get_tenant = useSelector((state) => state.tenants.current);
  //De-Structure id from useParams
  const { id } = useParams();

  //Setup state for values
  const [state, setState] = useState({
    ownerName: "",
    username: "",
    email: "",
    tenantName: "",
    contact: "",
    address: "",
    packageId: "",
    status: "",
    date: "",
    password: "",
    confirmPassword: "",
    logo: "",
    subscriptionId: "",
  });
  //State for file Input
  const [file, setFile] = useState("");
  //Use Effect to get Single Tenant API Hit
  useEffect(() => {
    if (id !== undefined) {
      //Dispatch current tenant
      dispatch(getSingleTenant(id));
    }
    //Dispatch all active packages
    dispatch(getTenantPackages("active"));
  }, [id]);

  console.log(file);
  //Use Effect hook to hit API call
  useEffect(() => {
    //Check for id
    if (id !== undefined && Object.keys(get_tenant).length !== 0) {
      //Set Current Tenant in state for update
      setState({ ...state, ...get_tenant });
      // Function to convert URL back to file
      async function urlToFile(url) {
        // Fetch the file
        let response = await fetch(url);
        let data = await response.blob();
        let metadata = {
          type: "image/jpeg",
        };
        let file = new File([data], "test.jpg", metadata);
        console.log(file);
        // Return the file object
        return file;
      }

      async function loadFile() {
        const fileGenerated = await urlToFile(
          `${DOMAIN}/public/tenants/images/${get_tenant.logo}`
        );

        //Set file
        setFile(fileGenerated);
      }
     
      if(get_tenant.logo){
        loadFile();
      }
    } else {
      //Else set state to empty
      setState({
        ownerName: "",
        username: "",
        email: "",
        tenantName: "",
        contact: "",
        address: "",
        packageId: "",
        status: "",
        date: "",
        password: "",
        confirmPassword: "",
        subscriptionId: "",
      });
    }

    // eslint-disable-next-line
  }, [get_tenant]);

  //Destructure values from the state
  const {
    ownerName,
    username,
    email,
    tenantName,
    contact,
    address,
    password,
    status,
    date,
    packageId,
    confirmPassword
  } = state;

  //Handle on submit function
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (ownerName === "") {
      toast("Enter owner name", { position: "top-right", type: "error" });
    } else if (username === "") {
      toast("Enter username", { position: "top-right", type: "error" });
    } else if (email === "") {
      toast("Enter username", { position: "top-right", type: "error" });
    } else if (tenantName === "") {
      toast("Enter enter company name", {
        position: "top-right",
        type: "error",
      });
    } else if (contact === "") {
      toast("Enter username", { position: "top-right", type: "error" });
    } else if (address === "") {
      toast("Enter username", { position: "top-right", type: "error" });
    } else if (password === "") {
      toast("Enter username", { position: "top-right", type: "error" });
    } else if (packageId === "") {
      toast("Please select package", { position: "top-right", type: "error" });
    } else if (status === "") {
      toast("Please select status", { position: "top-right", type: "error" });
    } else if (date === ""){
      toast("Please select date", {position: "top-right", type: "error"})
    }  else if(password !== confirmPassword){
      toast("Password does not Match !", {position: "top-right", type: "error"})
    }  else {
      //Check for image uploaded 
      if (file !== "") {
        //Function to convert file data in form data for upload
        function getFormData(object) {
          const formData = new FormData();
          formData.append("file", object);
          return formData;
        }
        //File Upload Axios Endpoint function
        const res = await FileUpload(getFormData(file));

        if (res?.success === true) {
          //NewState variable
          const newState = { ...state };
          newState.logo = res.filename;
          //Add uploaded file name into the state
          setState(newState);
          //After uploading image file submit other fields
          if (id !== undefined) {
            const data = {
              id: id,
              Data: newState,
            };

            console.log("Checking data before send => ", data)
            //Hit API Call using dispatch to updated tenant
            dispatch(updateTenant(data));
            //After added tenant clear states
            setState({
              ownerName: "",
              username: "",
              email: "",
              tenantName: "",
              contact: "",
              address: "",
              packageId: "",
              status: "",
              date: "",
              password: "",
              logo: "",
              subscriptionId: "",
            });
            //Also file state
            setFile("");
          } else {
            //Hit API Call using dispatch to add tenant
            dispatch(addTenant(newState));
            //After added tenant clear states
            setState({
              ownerName: "",
              username: "",
              email: "",
              tenantName: "",
              contact: "",
              address: "",
              packageId: "",
              status: "",
              date: "",
              password: "",
              logo: "",
              subscriptionId: "",
            });
            //Also file state
            setFile("");
          }
        }
      } else {
        //Upload data if image not selected
        if (id !== undefined) {
          const data = {
            id: id,
            Data: state,
          };
          //Hit API Call using dispatch to updated tenant
          dispatch(updateTenant(data));
          //After added tenant clear states
          setState({
            ownerName: "",
            username: "",
            email: "",
            tenantName: "",
            contact: "",
            address: "",
            packageId: "",
            status: "",
            date: "",
            password: "",
            logo: "",
            subscriptionId: "",
          });
          //Also file state
          setFile("");
        } else {
          //Hit API Call using dispatch to add tenant
          dispatch(addTenant(state));
          //After added tenant clear states
          setState({
            ownerName: "",
            username: "",
            email: "",
            tenantName: "",
            contact: "",
            address: "",
            packageId: "",
            status: "",
            date: "",
            password: "",
            logo: "",
            subscriptionId: "",
          });
          //Also file state
          setFile("");
        }
      }
    }
  };

  return (
    <Box m="0px 20px 15px 20px">
      {/* Header for New Tenant Page  */}
      <Header title="New Tenant" subTitle="Manage Application Tenants" />
      {/* Card for Add New Tenant Form  */}
      <Box className="mainCard">
        {/* Setup Grid for Add and Update Tenant form  */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}
        >
          <AvatarInput file={file} setFile={setFile} />
        </div>
        {/* Add New Tenant Form  */}
        {packages.length > 0 && (
          <GridForm
            title="Add New Tenant"
            inputs={tenantForm("Add Tenant", packages)}
            state={state}
            setState={setState}
            file={file}
            setFile={setFile}
            submit={handleOnSubmit}
          />
        )}
      </Box>
    </Box>
  );
};

export default NewTenant;
