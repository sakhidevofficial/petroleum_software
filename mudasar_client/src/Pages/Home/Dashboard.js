import "./dashboard.scss";
import Widget from "../../Components/widgets/Widget";
import UserWidget from "../../Components/widgets/UserWidget";
import Featured from "../../Components/featured/Featured";
import Chart from "../../Components/chart/Chart";
import Table from "../../Components/table/Table";
import { Grid } from "@mui/material";
import { useContext, useEffect } from "react";
import AuthContext from "../../context/auth/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  cleardata,
  getAllActiveCustomers,
  getAllStocks,
} from "../../redux/completeDataSlice/completeDataSlice";

const Dashboard = () => {
  //Call Auth Context & Extract Logout
  const { logout, user } = useContext(AuthContext);
  //get from store
  const stocks = useSelector((state) => state.completeData.stocks);
  const customers = useSelector((state) => state.completeData.customers);
  //Setup dispatch
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllStocks());
    dispatch(getAllActiveCustomers());

    //Call clear customers to clear customers from state on unmount
    return () => {
      dispatch(cleardata());
    };
  }, []);

  function analyzeBalances(data) {
    const result = {
      totalObjects: 0,
      balanceGreaterThanZero: 0,
      totalBalanceSum: 0,
    };

    for (const item of data) {
      result.totalObjects++;

      const balance = parseFloat(item.balance) || 0;
      result.totalBalanceSum += balance;

      if (balance > 0) {
        result.balanceGreaterThanZero++;
      }
    }

    return result;
  }

  const analyzeCustomer = analyzeBalances(customers);
  console.log(stocks);
  return (
    <div className="dashboard">
      <div className="dashboardContainer">
        <div
          className="widgets"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* calling widgets from component/widgets  */}
          <Grid container spacing={2}>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <UserWidget data={analyzeCustomer} />
            </Grid>
          </Grid>
          <hr />
          <Grid container spacing={2}>
            {stocks.map(
              (element) =>
                (element.product_name === "Petrol" ||
                  element.product_name === "Diesel") && (
                  <Grid key={element.id} item xs={12} sm={6} md={6} lg={3}>
                    <Widget type="users" data={element} />
                  </Grid>
                )
            )}

            {/* <Grid item xs={12} sm={6} md={6} lg={3}>
              <Widget type="order" user={user}/>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Widget type="earning" user={user}/>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Widget type="balance" user={user}/>
            </Grid> */}
          </Grid>
        </div>
        <div className="charts">
          <Grid container spacing={2}>
            {stocks.map(
              (element) =>
                element.product_name !== "Petrol" &&
                element.product_name !== "Diesel" && (
                  <Grid key={element.id} item xs={12} sm={6} md={6} lg={3}>
                    <Widget type="users" data={element} />
                  </Grid>
                )
            )}

          
          </Grid>
        </div>
    
      </div>
    </div>
  );
};

export default Dashboard;
