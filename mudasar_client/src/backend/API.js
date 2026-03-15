/**
 * API Configuration Constants
 * 
 * This file contains all API endpoint configurations for the application
 * organized by functional modules. Each module is clearly marked with comments.
 */

// Base API domain - points to the backend server
export const DOMAIN = "http://localhost:5001";

// All API endpoints grouped by functional modules
export const ENDPOINTS = {
  // ====================================================
  // 01. AUTHENTICATION MODULE ENDPOINTS
  // ====================================================
  LOGIN: DOMAIN + "/api/auth",                  // User login endpoint
  CHECKEMAIL: DOMAIN + "/api/email",            // Check if email is registered
  REGISTER: DOMAIN + "/api/users",              // Register new user
  GET_USER: DOMAIN + "/api/auth",               // Get logged-in user data

  // ====================================================
  // 02. PACKAGE MANAGEMENT MODULE ENDPOINTS
  // ====================================================
  ADD_PACKAGE: DOMAIN + "/api/packages",        // Add new package
  UPDATE_PACKAGE: DOMAIN + "/api/packages",     // Update existing package
  GET_PACKAGES: DOMAIN + "/api/packages",       // Get all packages
  GET_SINGLE_PACKAGE: DOMAIN + "/api/packages", // Get single package details
  DELETE_PACKAGE: DOMAIN + "/api/packages",     // Delete package

  // ====================================================
  // 03. FEATURE MANAGEMENT MODULE ENDPOINTS
  // ====================================================
  ADD_FEATURE: DOMAIN + "/api/features",        // Add new feature
  UPDATE_FEATURE: DOMAIN + "/api/features",     // Update existing feature
  GET_FEATURES: DOMAIN + "/api/features",       // Get all features
  DELETE_FEATURE: DOMAIN + "/api/features",     // Delete feature

  // ====================================================
  // 04. USER & TENANT MANAGEMENT MODULE ENDPOINTS
  // ====================================================
  USER: DOMAIN + "/api/users",                  // Base user endpoint
  TENANT_USER: DOMAIN + "/api/webadmin/tenants", // Tenant management
  DELETE_TENANT: DOMAIN + "/api/webadmin/tenants", // Delete tenant
  GET_TENANT_PACKAGES: DOMAIN + "/api/webadmin/tenants/packages", // Get tenant packages

  // ====================================================
  // 05. CUSTOMER MANAGEMENT MODULE ENDPOINTS
  // ====================================================
  CUSTOMER: DOMAIN + "/api/customers",          // Customer CRUD operations
  ALLCUSTOMERS: DOMAIN + "/api/allCustomers",   // Get all active customers
  CUSTOMERPAYMENT: DOMAIN + "/api/customerPayments", // Customer payments
  CUSTOMER_ADVANCE: DOMAIN + "/api/customerAdvances", // Customer advances

  // ====================================================
  // 06. SUPPLIER MANAGEMENT MODULE ENDPOINTS
  // ====================================================
  SUPPLIER: DOMAIN + "/api/suppliers",          // Supplier CRUD operations
  SUPPLIERPAYMENT: DOMAIN + "/api/supplierPayments", // Supplier payments
  ALLSUPPLIERS: DOMAIN + "/api/allSuppliers",   // Get all active suppliers

  // ====================================================
  // 07. EMPLOYEE MANAGEMENT MODULE ENDPOINTS
  // ====================================================
  EMPLOYEE: DOMAIN + "/api/employees",          // Employee CRUD operations
  ALLEMPLOYEE: DOMAIN + "/api/allEmployees",    // Get all employees
  EMPLOYEESALARY: DOMAIN + "/api/employeeSalary", // Employee salary
  EMPLOYEEADVANCE: DOMAIN + "/api/employeeAdvances", // Employee advances
  ALLADVANCE: DOMAIN + "/api/allEmployeeAdvances", // All active advances
  ADVANCEINSTALLMENT: DOMAIN + "/api/advanceInstallments", // Advance installments
  EMPLOYEEPAYMENT: DOMAIN + "/api/employeePayments", // Advance installments

  // ====================================================
  // 08. INVENTORY & OPERATIONS MODULE ENDPOINTS
  // ====================================================
  // Machine endpoints
  MACHINE: DOMAIN + "/api/machines",            // Machine CRUD operations
  ALLMACHINE: DOMAIN + "/api/allMachines",      // Get all machines
  
  // Product endpoints
  PRODUCT: DOMAIN + "/api/products",            // Product CRUD operations
  ALLPRODUCT: DOMAIN + "/api/allProducts",      // Get all products
  
  // Pricing endpoints
  PRICE: DOMAIN + "/api/prices",                // Price management
  CURRENTPRICE: DOMAIN + "/api/currentPrices",  // Current prices
  
  // Sales endpoints
  SALE: DOMAIN + "/api/sales",                 // Sales operations
  
  // Stock endpoints
  STOCK: DOMAIN + "/api/stocks",               // Stock management
  ALLSTOCK: DOMAIN + "/api/allStocks",         // All stock entries
  
  // Other inventory endpoints
  WASTAGE: DOMAIN + "/api/wastages",           // Wastage tracking
  DIP: DOMAIN + "/api/dips",                   // Dip measurements
  PURCHASE: DOMAIN + "/api/purchases",         // Purchase records
  
  // Reading endpoints
  READING: DOMAIN + "/api/readings",           // Meter readings
  CURRENTREADING: DOMAIN + "/api/currentReadings", // Current readings
  
  // Expense endpoints
  EXPENSE: DOMAIN + "/api/expenses",           // Expense tracking

  // ====================================================
  // 09. FINANCIAL MODULE ENDPOINTS
  // ====================================================
  CASH: DOMAIN + "/api/cashes",                // Cash management
  BANK: DOMAIN + "/api/bankTransactions",      // Bank transactions
  SINGLEBANK: DOMAIN + "bankSingleTransactions",
  // Closing endpoints
  CLOSE: DOMAIN + "/api/closings",             // Cashier closings
  PRINTCLOSE: DOMAIN + "/api/printClosing",    // Print closing report
  TODAYCLOSE: DOMAIN + "/api/checkClosing",    // Today's closing status

  // ====================================================
  // 10. REPORTING MODULE ENDPOINTS
  // ====================================================
  REPORT: DOMAIN + "/api/reports",             // Profit/loss reports
  CUSTOMERREPORT: DOMAIN + "/api/customerreports",             // Profit/loss reports
  GENREPORT: DOMAIN + "/api/genReport",         // Report generation
  PRINTREPORT: DOMAIN + "/api/printMonthlyReport",         // Report generation
  PRINTCUSTOMERREPORT: DOMAIN + "/api/printCustomerReport"         // Report generation
};