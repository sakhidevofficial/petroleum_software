import "./widget.scss";
import Avatar from "react-avatar";

const UserWidget = ({ data }) => {
  return (
    <div
      className="userWidget"
      style={{
        background: data.totalBalanceSum > 0 ? "#b1f3b1" : "#ffb4b4",
      }}
    >
      {/* Avatar Centered */}
      <Avatar className="avatar" round size="60" name="User" />

      {/* Stats Section */}
      <div className="statsRow">
        {/* Total Customers */}
        <div className="statBox">
          <div className="label">Active Customers</div>
          <div className="value">{data.totalObjects}</div>
        </div>
       {/* Total Credit Customers */}
        <div className="statBox">
          <div className="label">Credit Customers</div>
          <div className="value">{data.balanceGreaterThanZero}</div>
        </div>
        {/* Total Balance */}
        <div className="statBox">
          <div className="label">Total Balance</div>
          <div className="value">{data.totalBalanceSum?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</div>
        </div>

       
      </div>
    </div>
  );
};

export default UserWidget;
