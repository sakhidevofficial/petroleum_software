import React, { useContext, useState, Suspense, lazy } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from "../../Components/navbar/Navbar";
import Sidebar from "../../Components/sidebar/Sidebar";
import "./authapp.scss";
import "../../style/dark.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "../../Components/alert/Alert";
import AuthContext from "../../context/auth/AuthContext";
import Loader from "./Loader";
import EmployeeReport from "../../Pages/Reports/EmployeeReport";

// Lazily load all route components
const Dashboard = lazy(() => import("../../Pages/Home/Dashboard"));
const Subscription = lazy(() => import("../../Pages/Admin/Subscription/Subscription"));
const Features = lazy(() => import("../../Pages/Admin/Subscription/Features"));
const NewFeature = lazy(() => import("../../Pages/Admin/Subscription/NewFeature"));
const Packages = lazy(() => import("../../Pages/Admin/Subscription/Packages/Packages"));
const NewPackage = lazy(() => import("../../Pages/Admin/Subscription/Packages/NewPackage"));
const Tenants = lazy(() => import("../../Pages/Admin/Accounts/Tenants/Tenants"));
const NewTenant = lazy(() => import("../../Pages/Admin/Accounts/Tenants/NewTenant"));
const Users = lazy(() => import("../../Pages/Users/Users"));
const Customer = lazy(() => import("../../Pages/Customer/Customer"));
const Supplier = lazy(() => import("../../Pages/Supplier/Supplier"));
const Employee = lazy(() => import("../../Pages/Employee/Employee"));
const Machine = lazy(() => import("../../Pages/Machines/Machines"));
const Stock = lazy(() => import("../../Pages/Stock/Stock"));
const Products = lazy(() => import("../../Pages/Products/Products"));
const Prices = lazy(() => import("../../Pages/Prices/Prices"));
const TotalSale = lazy(() => import("../../Pages/Customer/TotalSale"));
const Purchase = lazy(() => import("../../Pages/Purchase/Purchase"));
const Readings = lazy(() => import("../../Pages/Readings/Readings"));
const CustomerPayment = lazy(() => import("../../Pages/Customer/CustomerPayment"));
const CustomerAdvance = lazy(() => import("../../Pages/Customer/CustomerAdvance"));
const SupplierPayment = lazy(() => import("../../Pages/Supplier/SupplierPayment"));
const EmployeeSalary = lazy(() => import("../../Pages/Employee/EmployeeSalary"));
const EmployeeAdvance = lazy(() => import("../../Pages/Employee/EmployeeAdvance"));
const EmployeePayment = lazy(() => import("../../Pages/Employee/EmployeePayment"));
const Expense = lazy(() => import("../../Pages/Expense/Expenses"));
const StockWastage = lazy(() => import("../../Pages/Stock/StockWastage"));
const StockDip = lazy(() => import("../../Pages/Stock/StockDip"));
const Report = lazy(() => import("../../Pages/Reports/Report"));
const CustomerReport = lazy(() => import("../../Pages/Reports/CustomerReport"));
const TotalSaleClosings = lazy(() => import("../../Pages/DataEntry/TotalSaleClosings"));
const AddShift = lazy(() => import("../../Pages/DataEntry/AddShift"));
const DailyCash = lazy(() => import("../../Pages/Finance/DailyCash"));
const BankTransaction = lazy(() => import("../../Pages/Finance/BankTransaction"));
const PageNotFount = lazy(() => import("../../Pages/PageNotFount"));

const AuthApp = ({ mode }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { logout, user } = useContext(AuthContext);

  return (
    <div className={mode === "dark" ? "authApp dark" : "authApp"}>
      <BrowserRouter>
        <Navbar
          setOpenSidebar={setOpenSidebar}
          openSidebar={openSidebar}
          className="authNavbar"
          user={user}
          logout={logout}
        />
        <ToastContainer theme="colored" closeButton={false} />
        <Alert />
        <div className="main">
          <Sidebar className="authSidebar" openSidebar={openSidebar} />
          <div className="appContainer">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/subscriptions" element={<Subscription />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/packages/new" element={<NewPackage />} />
                <Route path="/packages/update/:id" element={<NewPackage />} />
                <Route path="/features" element={<Features />} />
                <Route path="/features/new" element={<NewFeature />} />
                <Route path="/customers" element={<Customer />} />
                <Route path="/customerpayments" element={<CustomerPayment />} />
                <Route path="/customeradvances" element={<CustomerAdvance />} />
                <Route path="/suppliers" element={<Supplier />} />
                <Route path="/supplierpayments" element={<SupplierPayment />} />
                <Route path="/employees" element={<Employee />} />
                <Route path="/employeesalary" element={<EmployeeSalary />} />
                <Route path="/employeepayment" element={<EmployeePayment />} />
                <Route path="/employeeadvances" element={<EmployeeAdvance />} />
                <Route path="/machines" element={<Machine />} />
                <Route path="/readings" element={<Readings />} />
                <Route path="/products" element={<Products />} />
                <Route path="/prices" element={<Prices />} />
                <Route path="/sales" element={<TotalSale />} />
                <Route path="/purchases" element={<Purchase />} />
                <Route path="/reports" element={<Report />} />
                <Route path="/customerreports" element={<CustomerReport />} />
                <Route path="/employeereports" element={<EmployeeReport />} />
                <Route path="/stocks" element={<Stock />} />
                <Route path="/wastages" element={<StockWastage />} />
                <Route path="/dips" element={<StockDip />} />
                <Route path="/expenses" element={<Expense />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/tenants/new" element={<NewTenant />} />
                <Route path="/tenants/update/:id" element={<NewTenant />} />
                <Route path="/users" element={<Users />} />
                <Route path="/addShift" element={<AddShift />} />
                <Route path="/allclosings" element={<TotalSaleClosings />} />
                <Route path="/dailyCash" element={<DailyCash />} />
                <Route path="/bankTransaction" element={<BankTransaction />} />
                <Route path="/pagenotfound" element={<PageNotFount />} />
                <Route path="*" element={<Navigate to="/pagenotfound" replace />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default AuthApp;
