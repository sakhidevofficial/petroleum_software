import { useContext, useState } from "react";
import "./navbar.scss";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import {
//   ChatBubbleOutlineOutlined,
//   DarkModeOutlined,
//   FullscreenExitOutlined,
//   LightMode,
//   ListOutlined,
//   Menu,
//   NotificationsNoneOutlined,
// } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import ModeContext from "../../context/mode/ModeContext";
import Dropdown from "../dropdown/Dropdown";
import { DOMAIN } from "../../backend/API";

const Navbar = ({openSidebar,setOpenSidebar}) => {
  //Initializing the use Context to get dispatch method to change dark or light mode
  // const { darkMode, dispatch } = useContext(ModeContext);
  // Call Auth Context & Extract isAuthenticated
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const LogoutFunc = () => {
    logout();
    navigate("/");
  };
  //Initializing the Location Hook
  const location = useLocation();

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="top">
          <IconButton className="sidebarBtnOpen" onClick={()=>setOpenSidebar(!openSidebar)}>
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography className="brand">Mudasar Filling Station</Typography>
          </Link>
        </div>

        {isAuthenticated ? (
          <>
            <div className="items">

              <div className="item">
                <Typography>{user.name.split(" ")[0]},</Typography>
                {/* <div
                  className="toggle"
                  onClick={() => dispatch({ type: "TOGGLE" })}
                >
                  {darkMode ? (
                    <LightMode className="icon" />
                  ) : (
                    <DarkModeOutlined className="icon" />
                  )}
                </div> */}
              </div>
              <IconButton
                className="item"
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                <Avatar alt="Remy Sharp" src={ user.pic
                ? `${DOMAIN}/public/users/images/${user.pic}`
                : "./img/avatarfile.png"} />
              </IconButton>
            
            <Dropdown
              className="profileMenu"
              anchorElUser={anchorElUser}
              setAnchorElUser={setAnchorElUser}
              BackdropProps={{ invisible: false }}
              logout={LogoutFunc}
            />
            </div>
          </>
        ) : (
          <div className="items">
            {location.pathname === "/" ? (
              <div className="item">
                {/* <Link to="/signup" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    style={{ textTransform: "none" }}
                    size="small"
                    className="navlinkBtn"
                  >
                    Signup
                  </Button>
                </Link> */}
              </div>
            ) : (
              <div className="item">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    style={{ textTransform: "none" }}
                    size="small"
                    className="navlinkBtn"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
