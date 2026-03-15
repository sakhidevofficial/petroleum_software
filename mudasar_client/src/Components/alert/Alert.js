import React from "react";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useSelector } from "react-redux";

//Funtion to render MUI Alert

const Alert = () => {
  //Initialize useSelector to get Alert 
  const alerts = useSelector(state => state.alerts)

  const { enqueueSnackbar } = useSnackbar();

  const AlertStack = ({ id, msg, type }) => {
    useEffect(() => {
      enqueueSnackbar(
        msg,
        {
          variant: type,
          preventDuplicate: true,
          autoHideDuration: 6000,
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        },
        [id]
      );
    });
  };
  return (
  
    
    //Checking if there is any alert then render it
  alerts.length > 0 &&
  alerts.map((alert, key) => (
     
      <div className="alert" key={key}>
        <AlertStack id={alert.id} msg={alert.msg} type={alert.type} />
      </div>
    ))
  );
};

export default Alert;
