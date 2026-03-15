import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { toggleFunc } from "../../redux/sidebarSlice/sidebarSlice";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useLocalHook } from "./SidebarSource";
const Sidebar = ({openSidebar}) => {
  const { listItems } = useLocalHook();

  //Extract toggleList State from Redux store
  const sidebar = useSelector((state) => state.sidebar);
  
  function getToggle(item, id) {
    return item.id === id;
  }
  const toggle = (id) =>
    sidebar.filter((item) => {
      return getToggle(item, id);
    });

    
  //Initializing the use Dispatch
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    
    const handleResize = () => setIsMobile(mediaQuery.matches);
    
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    // Start of Custom Drawer Component
    <div className="sidebar" style={{ width: isMobile ? (openSidebar ? "210px" : "0px") : "210px",
      position: isMobile ? "absolute" : "relative",  // Ensure absolute on mobile,
        zIndex: isMobile ? 999 : "auto" }}>
      <div className="bottom">
        {listItems.map((listItem) => (
          //Start of MUI main List Component
          <List
            key={listItem.id}
            sx={{ width: "15%", minWidth: 210, padding: 0 }}
            subheader={
              listItem.category && (
                //Typography to differentiate various categories of list items
                <Typography className="title">{listItem.category}</Typography>
              )
            }
            className="list"
          >
            {/* Checking for Url if it exists in main list then make it link  */}
            {listItem.url ? (
              <Link to={listItem.url} style={{ textDecoration: "none" }}>
                {/* List Item Button of main list to create list Item  */}
                <ListItemButton
                  onClick={() => {
                    listItem.setList
                      ? 
                   
                      dispatch(toggleFunc({id: listItem.id}))
                      : listItem.clickFunc && listItem.clickFunc();
                  }}
                  className="li"
                >
                  {/* Icon for the main list Item  */}
                  <ListItemIcon className="icon">{listItem.icon}</ListItemIcon>
                  {/* Text for the main list Item  */}
                  <ListItemText
                    primary={
                      <Typography className="text">{listItem.label}</Typography>
                    }
                  />
                  {/* Chevron Icons to indicate open and closed list  */}
                  {listItem.setList && toggle(listItem.id)[0].toggle
                    ? listItem.nested && <ExpandLess className="chevron" />
                    : listItem.nested && <ExpandMore className="chevron" />}
                </ListItemButton>
              </Link>
            ) : (
              <ListItemButton
                onClick={() => {
                  listItem.setList
                    ?  dispatch(toggleFunc(listItem.id))
                    // dispatch({
                    //     type: listItem.setList,
                    //     payload: listItem.id,
                    //   })
                    : listItem.clickFunc && listItem.clickFunc();
                }}
                className="li"
              >
                {/* Icon for the main list Item  */}
                <ListItemIcon className="icon">{listItem.icon}</ListItemIcon>
                {/* Text for the main list Item  */}
                <ListItemText
                  primary={
                    <Typography className="text">{listItem.label}</Typography>
                  }
                />
                {/* {console.log(toggle(listItem.id)[0].toggle)} */}
                {/* Chevron Icons to indicate open and closed list  */}
                {listItem.setList && toggle(listItem.id)[0].toggle
                  ? listItem.nested && <ExpandLess className="chevron" />
                  : listItem.nested && <ExpandMore className="chevron" />}
              </ListItemButton>
            )}

            {listItem.nested &&
              listItem.nested.map((nestedItem) => (
                // MUI collapse to handle nested list items
                <Collapse
                  key={nestedItem.itemId}
                  in={toggle(listItem.id)[0].toggle}
                  timeout="auto"
                >
                  {/* Start of Nested list  */}
                  <List component="div" disablePadding className="nestedli">
                    {/* Add Link to List Item to redirect the component  */}
                    <Link
                      to={nestedItem.url}
                      style={{ textDecoration: "none" }}
                    >
                      {/* List Item Button to create list Item  */}
                      <ListItemButton sx={{ pl: 2 }}>
                        {/* Icon for the list Item  */}
                        <ListItemIcon className="icon">
                          {nestedItem.icon}
                        </ListItemIcon>
                        {/* Text for the list Item  */}
                        <ListItemText
                          primary={
                            <Typography className="text">
                              {nestedItem.label}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </Link>
                  </List>
                  {/* End of nested list  */}
                </Collapse>
              ))}
          </List>
          //End of MUI main List component
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
