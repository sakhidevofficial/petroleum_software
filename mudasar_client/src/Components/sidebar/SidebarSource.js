import React, { useContext } from "react";
import {
  DashboardCustomize,
  Payment,
  SwitchAccount,
  People,
  AssignmentInd,
  LocalAtm,
  Speed,
  TrendingUp,
  Assessment,
  AttachMoney,
  Visibility,
  LocalGasStation,
  Widgets,
  PriceChange,
  Settings,
  Receipt,
  Store,
  Opacity,
  FormatColorReset,
  HourglassBottom,
  CurrencyRupee,
  AccountBalance,
  AccountCircle,
  PowerSettingsNew,
} from "@mui/icons-material";
import AuthContext from "../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLocalHook = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const LogoutFunc = () => {
    logout();
    navigate("/");
  };

  const WebAdminPanel = [
    {
      id: 0,
      label: "Dashboard",
      icon: <DashboardCustomize className="icon" />,
      url: "/",
      category: "MAIN",
    },
    {
      id: 1,
      label: "Customer",
      icon: <SwitchAccount className="icon" />,
      setList: "TOGGLE_CUSTOMER",
      category: "ACCOUNTS",
      nested: [
        { itemId: 13, label: "Customers", icon: <SwitchAccount className="icon" />, url: "/customers" },
        { itemId: 14, label: "Customer Payments", icon: <AttachMoney className="icon" />, url: "/customerpayments" },
        { itemId: 15, label: "Customer Advance", icon: <LocalAtm className="icon" />, url: "/customeradvances" },
        { itemId: 16, label: "Customer Sales", icon: <Assessment className="icon" />, url: "/sales" },
      ],
    },
    {
      id: 2,
      label: "Supplier",
      icon: <People className="icon" />,
      setList: "TOGGLE_CUSTOMER",
      nested: [
        { itemId: 17, label: "Suppliers", icon: <People className="icon" />, url: "/suppliers" },
        { itemId: 18, label: "Suppliers Payments", icon: <Payment className="icon" />, url: "/supplierpayments" },
      ],
    },
    {
      id: 3,
      label: "Employee",
      icon: <SwitchAccount className="icon" />,
      setList: "TOGGLE_CUSTOMER",
      nested: [
        { itemId: 19, label: "Employee", icon: <AssignmentInd className="icon" />, url: "/employees" },
        { itemId: 20, label: "Employee Salary", icon: <LocalAtm className="icon" />, url: "/employeesalary" },
        { itemId: 21, label: "Employee Payment", icon: <AttachMoney className="icon" />, url: "/employeepayment" },
        { itemId: 22, label: "Employee Advances", icon: <Payment className="icon" />, url: "/employeeadvances" },
      ],
    },
    {
      id: 4,
      label: "Shift Closing",
      icon: <Speed className="icon" />,
      category: "DATA ENTRY",
      url: "/addShift",
    },
    {
      id: 5,
      label: "View Closings",
      icon: <Visibility className="icon" />,
      url: "/allclosings",
    },
    {
      id: 6,
      label: "Settings",
      icon: <Settings className="icon" />,
      category: "SYSTEM",
      setList: "TOGGLE_SETTINGS",
      nested: [
        { itemId: 23, label: "Machines", icon: <LocalGasStation className="icon" />, url: "/machines" },
        { itemId: 24, label: "Readings", icon: <Speed className="icon" />, url: "/readings" },
        { itemId: 25, label: "Products", icon: <Widgets className="icon" />, url: "/products" },
        { itemId: 26, label: "Price Management", icon: <PriceChange className="icon" />, url: "/prices" },
        { itemId: 27, label: "Users", icon: <People className="icon" />, url: "/users" },
      ],
    },
    {
      id: 7,
      label: "Reports",
      icon: <Receipt className="icon" />,
      setList: "TOGGLE_STOCK",
      nested: [
        { itemId: 28, label: "Get Report", icon: <Receipt className="icon" />, url: "/reports" },
        { itemId: 29, label: "Customer Report", icon: <Receipt className="icon" />, url: "/customerreports" },
        // { itemId: 29, label: "Employee Report", icon: <Receipt className="icon" />, url: "/employeereports" },
        { itemId: 30, label: "Expenses", icon: <Assessment className="icon" />, url: "/expenses" },
      ],
    },
    {
      id: 8,
      label: "Stock Management",
      icon: <Opacity className="icon" />,
      setList: "TOGGLE_STOCK",
      nested: [
        { itemId: 31, label: "Stock List", icon: <Opacity className="icon" />, url: "/stocks" },
        { itemId: 32, label: "Purchase Stock", icon: <Store className="icon" />, url: "/purchases" },
        { itemId: 33, label: "Dip Records", icon: <Assessment className="icon" />, url: "/dips" },
        { itemId: 34, label: "Stock Wastage", icon: <FormatColorReset className="icon" />, url: "/wastages" },
      ],
    },
    {
      id: 9,
      label: "Daily Cash",
      icon: <CurrencyRupee className="icon" />,
      category: "FINANCE",
      url: "/dailyCash",
    },
    {
      id: 10,
      label: "Bank Transaction",
      icon: <AccountBalance className="icon" />,
      url: "/bankTransaction",
    },
    {
      id: 12,
      label: "Logout",
      icon: <PowerSettingsNew className="icon" />,
      clickFunc: LogoutFunc,
       category: "LOGGING"
    },
  ].filter(Boolean);

  const AdminPanel = [
    {
      id: 0,
      label: "Dashboard",
      icon: <DashboardCustomize className="icon" />,
      url: "/",
      category: "MAIN",
    },
    {
      id: 1,
      label: "Customer",
      icon: <SwitchAccount className="icon" />,
      setList: "TOGGLE_CUSTOMER",
      category: "ACCOUNTS",
      nested: [
        { itemId: 1, label: "Customers", icon: <SwitchAccount className="icon" />, url: "/customers" },
        { itemId: 2, label: "Customer Balance", icon: <AttachMoney className="icon" />, url: "/customerpayments" },
      ],
    },
    {
      id: 2,
      label: "Supplier",
      icon: <People className="icon" />,
      setList: "TOGGLE_CUSTOMER",
      nested: [
        { itemId: 3, label: "Suppliers", icon: <People className="icon" />, url: "/suppliers" },
        { itemId: 4, label: "Suppliers Balance", icon: <Payment className="icon" />, url: "/supplierpayments" },
      ],
    },
    {
      id: 3,
      label: "Employee",
      icon: <SwitchAccount className="icon" />,
      setList: "TOGGLE_CUSTOMER",
      nested: [
        { itemId: 5, label: "Employee", icon: <AssignmentInd className="icon" />, url: "/employees" },
        { itemId: 6, label: "Employee Salary", icon: <LocalAtm className="icon" />, url: "/employeesalary" },
        { itemId: 7, label: "Employee Advances", icon: <Payment className="icon" />, url: "/employeeadvances" },
      ],
    },
    {
      id: 4,
      label: "Meter Reading",
      icon: <Speed className="icon" />,
      category: "DATA ENTRY",
      url: "/meters",
    },
    {
      id: 5,
      label: "POS",
      icon: <TrendingUp className="icon" />,
      url: "/pos",
    },
    {
      id: 6,
      label: "Sales",
      icon: <Assessment className="icon" />,
      url: "/sales",
    },
    {
      id: 7,
      label: "Settings",
      icon: <Settings className="icon" />,
      category: "SYSTEM",
      setList: "TOGGLE_SETTINGS",
      nested: [
        { itemId: 8, label: "Machines", icon: <LocalGasStation className="icon" />, url: "/machines" },
        { itemId: 9, label: "Readings", icon: <Speed className="icon" />, url: "/readings" },
        { itemId: 10, label: "Products", icon: <Widgets className="icon" />, url: "/products" },
        { itemId: 11, label: "Price Management", icon: <PriceChange className="icon" />, url: "/prices" },
        { itemId: 12, label: "Users", icon: <People className="icon" />, url: "/users" },
      ],
    },
    {
      id: 8,
      label: "Reports",
      icon: <Receipt className="icon" />,
      setList: "TOGGLE_STOCK",
      nested: [
        { itemId: 13, label: "Get Report", icon: <Receipt className="icon" />, url: "/reports" },
        { itemId: 14, label: "Expenses", icon: <Assessment className="icon" />, url: "/expenses" },
      ],
    },
    {
      id: 9,
      label: "Stock Management",
      icon: <Opacity className="icon" />,
      setList: "TOGGLE_STOCK",
      nested: [
        { itemId: 15, label: "Stock List", icon: <Opacity className="icon" />, url: "/stocks" },
        { itemId: 16, label: "Purchase Stock", icon: <Store className="icon" />, url: "/purchases" },
        { itemId: 17, label: "Dip Records", icon: <Assessment className="icon" />, url: "/dips" },
        { itemId: 18, label: "Stock Wastage", icon: <FormatColorReset className="icon" />, url: "/wastages" },
        { itemId: 19, label: "Stock Testing", icon: <HourglassBottom className="icon" />, url: "/features" },
      ],
    },
    {
      id: 10,
      label: "Profile",
      icon: <AccountCircle className="icon" />,
      url: "/sales",
      category: "USER",
    },
    {
      id: 11,
      label: "Logout",
      icon: <PowerSettingsNew className="icon" />,
      clickFunc: LogoutFunc,
    },
  ];

  const CashierPanel = [
    {
      id: 0,
      label: "Dashboard",
      icon: <DashboardCustomize className="icon" />,
      url: "/",
      category: "MAIN",
    },
    {
      id: 1,
      label: "Shift Closing",
      icon: <Speed className="icon" />,
      category: "DATA ENTRY",
      url: "/addShift",
    },
    {
      id: 2,
      label: "View Closings",
      icon: <Visibility className="icon" />,
      url: "/allclosings",
    },
    {
      id: 5,
      label: "Logout",
      icon: <PowerSettingsNew className="icon" />,
      clickFunc: LogoutFunc,
    },
  ];

  const listItems = (
    (user.access === "web_admin" && WebAdminPanel) ||
    (user.access === "admin" && AdminPanel) ||
    (user.access === "cashier" && CashierPanel) ||
    []
  ).filter(Boolean);

  return { listItems };
};
