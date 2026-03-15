require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const routes = require("./routes/routes");
const path = require("path");
const auth = require("./middlewares/auth");
const supplierPaymentsController = require("./controllers/supplierPayments");

const app = express();

// Normalize trailing slash so /api/supplierPayments/ matches /api/supplierPayments
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith("/")) {
    req.url = req.path.slice(0, -1) + (req.url.slice(req.path.length) || "");
  }
  next();
});

app.use(cors());
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-auth-token");
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static("public"));

// Register supplier payment POST at app level (validation done inside controller, returns 400 only)
app.post("/api/supplierPayments", auth, supplierPaymentsController.addSupplierPayment);
app.post("/api/supplierpayments", auth, supplierPaymentsController.addSupplierPayment);

app.use("/", routes);

// 404 when no route matches (so API clients get JSON, not HTML)
app.use((req, res) => {
  res.status(404).json({ errors: { msg: "Route not found" }, success: false });
});

// Global error handler: log errors and return 500 with message in development
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  const message = process.env.NODE_ENV === "production" ? "Internal Server Error" : (err.message || "Internal Server Error");
  res.status(500).json({ errors: { msg: message }, success: false });
});

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
