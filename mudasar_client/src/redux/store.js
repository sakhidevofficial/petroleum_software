import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice/sidebarSlice";
import packageSlice from "./webAdmin/packagesSlice/packageSlice";
import alertSlice from "./alertSlice/alertSlice";
import featureSlice from "./webAdmin/featuresSlice/featureSlice";
import tenantSlice from "./webAdmin/tenantSlice/tenantSlice";
import userSlice from "./userSlice/userSlice"
import customerSlice from "./customerSlice/customerSlice";
import supplierSlice from "./supplierSlice/supplierSlice";
import employeeSlice from "./employeeSlice/employeeSlice";
import machineSlice from "./machineSlice/machineSlice";
import productSlice from "./productSlice/productSlice";
import saleSlice from "./saleSlice/saleSlice";
import stockSlice from "./stockSlice/stockSlice";
import purchaseStockSlice from "./purchaseStockSlice/purchaseStockSlice";
import readingSlice from "./readingSlice/readingSlice";
import customerPaymentSlice from "./customerPaymentSlice/customerPaymentSlice";
import supplierPaymentSlice from "./supplierPaymentSlice/supplierPaymentSlice";
import employeeSalarySlice from "./employeeSalarySlice/employeeSalarySlice";
import expenseSlice from "./expenseSlice/expenseSlice";
import priceSlice from "./priceSlice/priceSlice";
import wastageSlice from "./wastageSlice/wastageSlice";
import dipSlice from "./dipSlice/dipSlice";
import reportSlice from "./reportSlice/reportSlice";
import completeDataSlice from "./completeDataSlice/completeDataSlice";
import employeeAdvanceSlice from "./employeeAdvanceSlice/employeeAdvanceSlice";
import closingSlice  from "./closingsSlice/closingsSlice";
import cashSlice  from "./cashSlice/cashSlice";
import  bankSlice  from "./bankSlice/bankSlice";
import  customerAdvanceSlice  from "./customerAdvanceSlice/customerAdvanceSlice";
import  employeePaymentSlice  from "./employeePaymentSlice/employeePaymentSlice";

export const store = configureStore({
    reducer: {
        alerts: alertSlice,
        users: userSlice,
        customers: customerSlice,
        customerpayments: customerPaymentSlice,
        suppliers: supplierSlice,
        customerAdvances: customerAdvanceSlice,
        supplierpayments: supplierPaymentSlice,
        employees: employeeSlice,
        salaries: employeeSalarySlice,
        advances: employeeAdvanceSlice,
        employeepayments: employeePaymentSlice,
        machines: machineSlice,
        readings: readingSlice,
        products: productSlice,
        prices: priceSlice,
        stocks: stockSlice,
        wastages: wastageSlice,
        dips: dipSlice,
        purchases: purchaseStockSlice,
        sales: saleSlice,
        closings: closingSlice,
        cashes: cashSlice,
        banks: bankSlice,
        expenses: expenseSlice,
        reports: reportSlice,
        sidebar: sidebarReducer,
        packages: packageSlice,
        features: featureSlice,
        tenants: tenantSlice,
        completeData: completeDataSlice
    }
})