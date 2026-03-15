import {
  AccountCircle,
  Dashboard,
  PowerSettingsNew,
} from "@mui/icons-material";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

//Dropdown Menu Items Array
const settingItems = [
  {
    id: 1,
    title: "Dashboard",
    icon: <Dashboard style={{ fontSize: "20px" }} />,
  },
  // {
  //   id: 2,
  //   title: "Profile",
  //   icon: <AccountCircle style={{ fontSize: "20px" }} />,
  // },
  {
    id: 3,
    title: "Logout",
    icon: <PowerSettingsNew style={{ fontSize: "20px" }} />,
  },
];

export default function Dropdown({ anchorElUser, setAnchorElUser, logout }) {
  const navigate = useNavigate();
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <Box
      sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
      className="dropdown"
    >
      <Menu
        sx={{ mt: "30px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="dropdownMenu"
        style={{ marginLeft: "-20px" }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settingItems.map((setting) => (
          <MenuItem key={setting.id} onClick={() => {
            handleCloseUserMenu()

            if(setting.title === "Logout"){
              logout()
            } else if(setting.title === "Dashboard"){
              navigate("/")
            }
          }}>
            <div
              style={{
                marginRight: "10px",
                color: "gray",
                display: "flex",
                alignItems: "center",
              }}
            >
              {setting.icon}
              <Typography
                textAlign="center"
                style={{ fontSize: "14px", marginLeft: "10px" }}
              >
                {setting.title}
              </Typography>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
