import React from "react";
import "./card.scss";

import { CheckCircle, DoneAll, RemoveDone, ShoppingCart } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import Avatar from 'react-avatar'

function capitalize(string) {
  return string && string?.charAt(0)?.toUpperCase() + string?.slice(1);
}
const Card = ({id, selected, handleRegister,  setSelected, state, setState, title, color, image, price, feature }) => {
  //Handle on click 
  const handleOnClick = () => {
    setSelected({checked: true, id: id})
    setState({...state, packageId: id})
  }
  
  return (
    <div className="card" style={{background: (selected !== undefined && selected.checked) && (selected !== undefined && selected.id === id) && "#303134"}} onClick={window.location.href === "http://localhost:3000/signup" ? handleOnClick : undefined }>
     <CheckCircle sx={{fontSize: "40px", color: "green", visibility: selected?.checked && selected?.id === id ? "visible":"hidden"}}/>
      {/* Header section of Subscription card  */}
     
      <div className="top">
        <Avatar src={image} size="80" round={true} />
        <h4 className="title">{capitalize(title)}</h4>
      </div>
      {/* Middle section of Subscription card  */}
      <div className="middle">
        <h5 className={`price ${title}`}>Rs. {price}</h5>

        <div className="items">
       
          {Array.isArray(feature) && feature.map((element) => {
            return (
              <div key={element.id} className="item" style={{display: "flex", justifyContent: "start"}}>
                {element.groupStatus ? (
                  <DoneAll className="icon positive" />
                ) : (
                  <RemoveDone className="icon negative" />
                )}
                <Typography>{capitalize(element.groupDescription  ? element.groupDescription.substr(0, 25)+"..." : "sales module")}</Typography>
              </div>
            );
          })}

          <div className="item">
            <Button
              variant="contained"
              
              className={`button ${title} `}
              style={{
                width: "100%",
                backgroundColor: color
              }}
              onClick={()=>handleRegister()}
            >
              <ShoppingCart fontSize="small" />
              Buy
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
