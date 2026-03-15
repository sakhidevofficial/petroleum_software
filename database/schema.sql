-- ============================================================
-- Petrol Pump / Saimon Fuel - SQL Database Schema
-- Generated from Mongoose models. Compatible with MySQL/MariaDB.
-- For PostgreSQL: replace AUTO_INCREMENT with SERIAL, adjust types.
-- ============================================================

-- ---------------------------------------------------------------------------
-- Core / Auth
-- ---------------------------------------------------------------------------

CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(30)     NOT NULL,
    username        VARCHAR(30)     NOT NULL UNIQUE,
    access          VARCHAR(50)     NOT NULL,
    email           VARCHAR(255),
    shift           VARCHAR(50),
    contact         VARCHAR(50)     NOT NULL,
    address         VARCHAR(100)    NOT NULL,
    pic             VARCHAR(500),
    password        VARCHAR(1024)   NOT NULL,
    status          ENUM('active', 'deactive') DEFAULT 'active',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Features (required before roles / role_features)
-- ---------------------------------------------------------------------------

CREATE TABLE features (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(30)     NOT NULL,
    description     VARCHAR(100)   NOT NULL,
    status          ENUM('active', 'deactive'),
    joined_at       DATETIME        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL
);

CREATE TABLE role_features (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    role_id         INT             NOT NULL,
    feature_id      INT             NOT NULL,
    can_read        BOOLEAN         DEFAULT TRUE,
    can_write       BOOLEAN         DEFAULT TRUE,
    can_update      BOOLEAN         DEFAULT TRUE,
    can_delete      BOOLEAN         DEFAULT TRUE,
    FOREIGN KEY (role_id)    REFERENCES roles(id)    ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
);

CREATE TABLE packages (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(30)     NOT NULL,
    description     TEXT            NOT NULL,
    price           DECIMAL(12,2)   NOT NULL,
    image           VARCHAR(500),
    expires_in_months INT           NOT NULL,
    group_data      JSON,
    features        JSON,
    color           VARCHAR(50)     NOT NULL,
    status          VARCHAR(50)     NOT NULL
);

CREATE TABLE tenants (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    owner_name      VARCHAR(30)     NOT NULL,
    username        VARCHAR(100)    NOT NULL UNIQUE,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    tenant_name     VARCHAR(50),
    contact         VARCHAR(50)     NOT NULL,
    address         VARCHAR(100)    NOT NULL,
    status          ENUM('active', 'deactive') NOT NULL,
    logo            VARCHAR(500),
    date            VARCHAR(20)     NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    package_id      INT             NOT NULL,
    tenant_id       INT             NOT NULL,
    starts_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ends_at         DATETIME        NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id)  REFERENCES tenants(id)  ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Products & Pricing
-- ---------------------------------------------------------------------------

CREATE TABLE products (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    type            VARCHAR(50)     NOT NULL,
    pic             VARCHAR(500),
    status          VARCHAR(50)     NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prices (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    product_id      INT             NOT NULL,
    purchase_id     INT,
    remaining_stock INT             NOT NULL DEFAULT 0,
    cost_price      DECIMAL(12,2)   NOT NULL,
    old_selling_price DECIMAL(12,2) NOT NULL,
    new_selling_price DECIMAL(12,2) NOT NULL,
    price_difference DECIMAL(12,2)  NOT NULL DEFAULT 0,
    difference_value DECIMAL(12,2)  NOT NULL DEFAULT 0,
    date            VARCHAR(20)     NOT NULL,
    status          ENUM('open', 'locked') DEFAULT 'open',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE stocks (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    product_id      INT             NOT NULL UNIQUE,
    stock           DECIMAL(12,2)   NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Customers
-- ---------------------------------------------------------------------------

CREATE TABLE customers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(255),
    contact         VARCHAR(50)     NOT NULL,
    address         VARCHAR(255)   NOT NULL,
    balance         DECIMAL(12,2)   DEFAULT 0,
    pic             VARCHAR(500),
    status          ENUM('active', 'deactive') NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Suppliers
-- ---------------------------------------------------------------------------

CREATE TABLE suppliers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    company_name    VARCHAR(100)    NOT NULL,
    email           VARCHAR(255),
    contact         VARCHAR(50)     NOT NULL,
    address         VARCHAR(255)   NOT NULL,
    balance         DECIMAL(12,2)   DEFAULT 0,
    pic             VARCHAR(500),
    status          ENUM('active', 'deactive') NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Employees
-- ---------------------------------------------------------------------------

CREATE TABLE employees (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(255),
    contact         VARCHAR(50),
    salary          DECIMAL(12,2)   NOT NULL,
    advance         DECIMAL(12,2)   NOT NULL,
    designation     VARCHAR(100)   NOT NULL,
    address         VARCHAR(255)   NOT NULL,
    pic             VARCHAR(500),
    status          ENUM('active', 'deactive') NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Sales (header + line items)
-- ---------------------------------------------------------------------------

CREATE TABLE sales (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    receipt_no      INT,
    customer_id     INT             NOT NULL,
    status          ENUM('locked', 'open') DEFAULT 'open',
    date            VARCHAR(20)     NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE sale_items (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    sale_id         INT             NOT NULL,
    product_id      INT             NOT NULL,
    price_id        INT             NOT NULL,
    amount          DECIMAL(12,2)   NOT NULL,
    description     VARCHAR(255),
    FOREIGN KEY (sale_id)    REFERENCES sales(id)     ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (price_id)   REFERENCES prices(id)    ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Purchases
-- ---------------------------------------------------------------------------

CREATE TABLE purchases (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    product_id      INT             NOT NULL,
    supplier_id     INT             NOT NULL,
    quantity        DECIMAL(12,2)   NOT NULL,
    cost_price      DECIMAL(12,2)   NOT NULL DEFAULT 0,
    selling_price   DECIMAL(12,2)   NOT NULL DEFAULT 0,
    paid_amount     DECIMAL(12,2)   NOT NULL DEFAULT 0,
    date            VARCHAR(20)     NOT NULL,
    status          ENUM('open', 'locked') DEFAULT 'open',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id)  REFERENCES products(id)  ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Machines & Readings
-- ---------------------------------------------------------------------------

CREATE TABLE machines (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    type            VARCHAR(50)     NOT NULL,
    initial_reading DECIMAL(12,2)  NOT NULL,
    status          VARCHAR(50)     NOT NULL,
    lock_status     ENUM('open', 'locked') DEFAULT 'open',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE readings (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    machine_id      INT             NOT NULL,
    product_id      INT             NOT NULL,
    price_id        INT             NOT NULL,
    new_reading     DECIMAL(12,2)   NOT NULL,
    prev_reading    DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (price_id)   REFERENCES prices(id)   ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Dips
-- ---------------------------------------------------------------------------

CREATE TABLE dips (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    product_id      INT             NOT NULL,
    prev_dip        DECIMAL(12,2)   NOT NULL,
    dip             DECIMAL(12,2)   NOT NULL,
    gain            DECIMAL(12,2)   DEFAULT 0,
    date            VARCHAR(20)     NOT NULL,
    status          ENUM('locked', 'open') DEFAULT 'open',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Expenses & Wastage
-- ---------------------------------------------------------------------------

CREATE TABLE expenses (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    description     TEXT,
    amount          DECIMAL(12,2)   NOT NULL,
    status          ENUM('locked', 'open') DEFAULT 'open',
    date            VARCHAR(20)     NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE wastages (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    product_id      INT             NOT NULL,
    quantity        DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    status          ENUM('open', 'locked') DEFAULT 'open',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Bank & Cash (cashier closing)
-- ---------------------------------------------------------------------------

CREATE TABLE cashier_closings (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT             NOT NULL,
    bank_amount         DECIMAL(12,2)   NOT NULL,
    customer_debit_ids   JSON,
    customer_credit_ids  JSON,
    customer_advance_ids JSON,
    employee_debit_ids  JSON,
    employee_credit_ids JSON,
    expenses_ids        JSON,
    stock_dip_ids        JSON,
    status              ENUM('locked', 'open') DEFAULT 'open',
    date                VARCHAR(20)     NOT NULL,
    created_on          DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cashier_closing_items (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    closing_id      INT             NOT NULL,
    product_id      INT,
    price_id        INT,
    prev_stock      DECIMAL(12,2),
    new_stock       DECIMAL(12,2),
    quantity        DECIMAL(12,2),
    test_entry      DECIMAL(12,2),
    readings        JSON,
    FOREIGN KEY (closing_id) REFERENCES cashier_closings(id) ON DELETE CASCADE
);

CREATE TABLE banks (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    total_cash      DECIMAL(12,2)   DEFAULT 0,
    deposit_amount  DECIMAL(12,2)   DEFAULT 0,
    description     TEXT,
    status          ENUM('pending', 'deposited') DEFAULT 'pending',
    date            VARCHAR(20)     NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cashes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    closing_id      INT             NOT NULL,
    cash            DECIMAL(12,2)   DEFAULT 0,
    description     TEXT,
    status          ENUM('pending', 'collected') DEFAULT 'pending',
    collection_date  VARCHAR(20),
    date            VARCHAR(20)     NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(id)            ON DELETE CASCADE,
    FOREIGN KEY (closing_id) REFERENCES cashier_closings(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Customer payments & advances
-- ---------------------------------------------------------------------------

CREATE TABLE customer_payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    customer_id     INT             NOT NULL,
    prev_amount     DECIMAL(12,2)   NOT NULL,
    paying_amount   DECIMAL(12,2)   NOT NULL,
    rem_amount      DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    status          ENUM('locked', 'open') DEFAULT 'open',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE customer_advances (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    customer_id     INT             NOT NULL,
    description     VARCHAR(255)   NOT NULL,
    amount          DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    status          ENUM('locked', 'open') DEFAULT 'open',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Supplier payments
-- ---------------------------------------------------------------------------

CREATE TABLE supplier_payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    supplier_id     INT             NOT NULL,
    prev_amount     DECIMAL(12,2)   NOT NULL,
    amount          DECIMAL(12,2)   NOT NULL,
    rem_amount      DECIMAL(12,2)   NOT NULL,
    status          ENUM('locked', 'open') DEFAULT 'open',
    date            VARCHAR(20)     NOT NULL,
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Employee payments, salary, advances
-- ---------------------------------------------------------------------------

CREATE TABLE employee_payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    employee_id     INT             NOT NULL,
    amount          DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    prev_advance    DECIMAL(12,2),
    rem_advance     DECIMAL(12,2),
    status          ENUM('locked', 'open') DEFAULT 'open',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE employee_salaries (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    employee_id     INT             NOT NULL,
    net_salary      DECIMAL(12,2)   DEFAULT 0,
    salary_of_month VARCHAR(20),
    salary_of_year  VARCHAR(10),
    date            VARCHAR(20)     NOT NULL,
    status          ENUM('pending', 'paid') DEFAULT 'pending',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE employee_advances (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             NOT NULL,
    employee_id     INT             NOT NULL,
    amount          DECIMAL(12,2)   DEFAULT 0,
    description     VARCHAR(255)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    status          ENUM('locked', 'open') DEFAULT 'open',
    created_on      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Fix: role_features references features(id) - ensure features exists first
-- (features table created above before roles; for roles we need to add FK after)
-- ---------------------------------------------------------------------------

-- Optional: indexes for common lookups
CREATE INDEX idx_customers_user_id    ON customers(user_id);
CREATE INDEX idx_sales_user_date      ON sales(user_id, date);
CREATE INDEX idx_sales_customer_id    ON sales(customer_id);
CREATE INDEX idx_purchases_supplier   ON purchases(supplier_id);
CREATE INDEX idx_purchases_date       ON purchases(date);
CREATE INDEX idx_prices_product_id   ON prices(product_id);
CREATE INDEX idx_readings_machine_id  ON readings(machine_id);
CREATE INDEX idx_dips_product_date    ON dips(product_id, date);
