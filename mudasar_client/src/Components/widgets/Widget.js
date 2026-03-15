import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  AccountBalanceWalletOutlined,
  Business,
  KeyboardArrowDown,
  MonetizationOnOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import petrolCane from "../../img/petrolCane.webp";
import dieselCane from "../../img/DieselCane.jpg";
import Avatar from "react-avatar";
import { DOMAIN } from "../../backend/API";

const Widget = ({ type, data }) => {
  // let data;

  //Temporary
  const amount = 100;
  const diff = 20;

  const productType = (data.product_type || "").toLowerCase();

  return (
    <div className="widget" style={{background: (productType === "petrol" || productType === "diesel") && data.stock < 2000 ?  "#ffb4b4" : "#b1f3b1"}}>
      <div className="left">
        <div style={{display: "flex", alignItems: "center"}}>

      <Avatar src={productType !== "mobile" ? (productType === "petrol" ? petrolCane : dieselCane) : (data.product_pic ? `${DOMAIN}/public/product/images/${data.product_pic}` : './img/avatarfile.png')} round size="30" style={{marginRight: "10px"}}/>
        <span className="title">{data.product_name}</span>
        </div>
        <span className="counter">
          {"Qty."}
          <span style={{color: data.stock > 0 ? "green": "#ff0000"}}>

            {data.stock}
          </span>
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          {/* <KeyboardArrowUpIcon /> */}
          Rs. {data.new_selling_price || 0}
        </div>
        <div className="percentage positive" style={{ color: "crimson" }}>
          {/* <KeyboardArrowDown /> */}
          Rs. {data.cost_price || 0}
        </div>
        {/* <Business
          className="icon"
          style={{ color: "crimson", backgroundColor: "rgba(255, 0,0, 0.2)" }}
        /> */}

      </div>
    </div>
  );
};

export default Widget;
