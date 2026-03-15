import { Typography, Box, useTheme, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { colorTokens } from "../../theme";


const Header = ({ title, subTitle, link, icon, dialog, btnIcon, setDialog, addBtnTitle, secondaryBtnTitle, secondaryBtnIcon, setSecondaryDialog, secondaryDialog }) => {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);
  return (
    <Box
      m="0px 20px 30px 0px"
      p="10px 20px 0 20px"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        height: "80px",
        top: "0px",
        width: "100%",
        zIndex: 2
      }}
      bgcolor={theme.palette.background.main}
      className="header"
    >
      <Box >
        
        <Typography
          style={{ fontSize: "20px", display: "flex", alignItems: "center", }}
          color={colors.grey[200]}
          fontWeight="550"
          sx={{ mt: "10px" }}
        >
          {icon}
          {title}
        </Typography>
        <Typography style={{ fontSize: "16px" }} color={colors.grey[400]}>
          {subTitle}
        </Typography>
      </Box>
      <Box style={{display: "flex", flexDirection: "column"}}>

      {/* Show button for link  */}
      {setDialog && ( <Button sx={{mb:1, mt:1}} color="primary" onClick={()=>setDialog(!dialog)} component={Link} to={link} variant="contained">
         {btnIcon && btnIcon} {addBtnTitle}
        </Button>)}
        {secondaryBtnTitle && ( <Button  color="success" onClick={()=>setSecondaryDialog(!secondaryDialog)} component={Link} to={link} variant="contained">
          {secondaryBtnIcon} {secondaryBtnTitle}
        </Button>)}
      {link !== window.location.pathname && link && (
        <Button  color="primary" component={Link} to={link} variant="contained">
          Add New
        </Button>
      )}
      </Box>
    </Box>
  );
};

export default Header;
