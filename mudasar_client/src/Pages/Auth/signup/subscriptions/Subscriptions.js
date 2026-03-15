import { Grid } from "@mui/material";
import React, { useState } from "react";
import PlanCard from "../../../../Components/card/PlanCard";
import "./subscriptions.scss";
// import { data } from "./plansSource";

const Subcriptions = ({data, state, setState, handleRegister}) => {
  const [selected, setSelected] = useState({
    checked: false,
    id: ""
  })
  return (
    <div className="subscription">
      <Grid container spacing={3} maxWidth="md">
        {/* Getting data of subscription plan and mapping to render  */}
        {data.map((element) => {
          return (
            <Grid key={element.id} item md={4}>
              {/* Calling the card component to render each plan  */}
              {element.status === "active" && <PlanCard
                id= {element.id}
                title={(element.plan)}
                image={element.image}
                price={element.price}
                feature={element.group}
                color={element.color}
                selected={selected}
                setSelected={setSelected}
                state={state}
                setState={setState}
                handleRegister={handleRegister}
              />}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Subcriptions;
