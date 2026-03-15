-- ============================================================
-- Petrol Pump / Saimon Fuel - PostgreSQL Schema for Supabase
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ---------------------------------------------------------------------------
-- Core / Auth
-- ---------------------------------------------------------------------------

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(30)     NOT NULL,
    username        VARCHAR(30)     NOT NULL UNIQUE,
    access          VARCHAR(50)     NOT NULL,
    email           VARCHAR(255),
    shift           VARCHAR(50),
    contact         VARCHAR(50)     NOT NULL,
    address         VARCHAR(100)    NOT NULL,
    pic             VARCHAR(500),
    password        VARCHAR(1024)   NOT NULL,
    status          VARCHAR(20)     DEFAULT 'active' CHECK (status IN ('active', 'deactive')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Features (required before roles / role_features)
-- ---------------------------------------------------------------------------

CREATE TABLE features (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(30)     NOT NULL,
    description     VARCHAR(100)   NOT NULL,
    status          VARCHAR(20)     CHECK (status IN ('active', 'deactive')),
    joined_at       TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE roles (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL
);

CREATE TABLE role_features (
    id              SERIAL PRIMARY KEY,
    role_id         INTEGER         NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    feature_id      INTEGER         NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    can_read        BOOLEAN         DEFAULT TRUE,
    can_write       BOOLEAN         DEFAULT TRUE,
    can_update      BOOLEAN         DEFAULT TRUE,
    can_delete      BOOLEAN         DEFAULT TRUE
);

CREATE TABLE packages (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(30)     NOT NULL,
    description     TEXT            NOT NULL,
    price           DECIMAL(12,2)   NOT NULL,
    image           VARCHAR(500),
    expires_in_months INTEGER       NOT NULL,
    group_data      JSONB,
    features        JSONB,
    color           VARCHAR(50)     NOT NULL,
    status          VARCHAR(50)     NOT NULL
);

CREATE TABLE tenants (
    id              SERIAL PRIMARY KEY,
    owner_name      VARCHAR(30)     NOT NULL,
    username        VARCHAR(100)    NOT NULL UNIQUE,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    tenant_name     VARCHAR(50),
    contact         VARCHAR(50)     NOT NULL,
    address         VARCHAR(100)    NOT NULL,
    status          VARCHAR(20)     NOT NULL CHECK (status IN ('active', 'deactive')),
    logo            VARCHAR(500),
    date            VARCHAR(20)     NOT NULL,
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id              SERIAL PRIMARY KEY,
    package_id      INTEGER         NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    tenant_id       INTEGER         NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    starts_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    ends_at         TIMESTAMPTZ     NOT NULL,
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Products & Pricing
-- ---------------------------------------------------------------------------

CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    type            VARCHAR(50)     NOT NULL,
    pic             VARCHAR(500),
    status          VARCHAR(50)     NOT NULL,
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE prices (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER         NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    purchase_id     INTEGER,
    remaining_stock INTEGER         NOT NULL DEFAULT 0,
    cost_price      DECIMAL(12,2)   NOT NULL,
    old_selling_price DECIMAL(12,2) NOT NULL,
    new_selling_price DECIMAL(12,2) NOT NULL,
    price_difference DECIMAL(12,2)  NOT NULL DEFAULT 0,
    difference_value DECIMAL(12,2)  NOT NULL DEFAULT 0,
    date            VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('open', 'locked')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE stocks (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER         NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    stock           DECIMAL(12,2)   NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- Customers
-- ---------------------------------------------------------------------------

CREATE TABLE customers (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(255),
    contact         VARCHAR(50)     NOT NULL,
    address         VARCHAR(255)   NOT NULL,
    balance         DECIMAL(12,2)   DEFAULT 0,
    pic             VARCHAR(500),
    status          VARCHAR(20)     NOT NULL CHECK (status IN ('active', 'deactive')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Suppliers
-- ---------------------------------------------------------------------------

CREATE TABLE suppliers (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    company_name    VARCHAR(100)    NOT NULL,
    email           VARCHAR(255),
    contact         VARCHAR(50)     NOT NULL,
    address         VARCHAR(255)   NOT NULL,
    balance         DECIMAL(12,2)   DEFAULT 0,
    pic             VARCHAR(500),
    status          VARCHAR(20)     NOT NULL CHECK (status IN ('active', 'deactive')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Employees
-- ---------------------------------------------------------------------------

CREATE TABLE employees (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(255),
    contact         VARCHAR(50),
    salary          DECIMAL(12,2)   NOT NULL,
    advance         DECIMAL(12,2)   NOT NULL,
    designation     VARCHAR(100)   NOT NULL,
    address         VARCHAR(255)   NOT NULL,
    pic             VARCHAR(500),
    status          VARCHAR(20)     NOT NULL CHECK (status IN ('active', 'deactive')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Sales (header + line items)
-- ---------------------------------------------------------------------------

CREATE TABLE sales (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receipt_no      INTEGER,
    customer_id     INTEGER         NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    status          VARCHAR(20)     DEFAULT 'open' CHECK (status IN ('locked', 'open')),
    date            VARCHAR(20)     NOT NULL,
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE sale_items (
    id              SERIAL PRIMARY KEY,
    sale_id         INTEGER         NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id      INTEGER         NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price_id        INTEGER         NOT NULL REFERENCES prices(id) ON DELETE CASCADE,
    amount          DECIMAL(12,2)   NOT NULL,
    description     VARCHAR(255)
);

-- ---------------------------------------------------------------------------
-- Purchases
-- ---------------------------------------------------------------------------

CREATE TABLE purchases (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER         NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_id     INTEGER         NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    quantity        DECIMAL(12,2)   NOT NULL,
    cost_price      DECIMAL(12,2)   NOT NULL DEFAULT 0,
    selling_price   DECIMAL(12,2)   NOT NULL DEFAULT 0,
    paid_amount     DECIMAL(12,2)   NOT NULL DEFAULT 0,
    date            VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('open', 'locked')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Machines & Readings
-- ---------------------------------------------------------------------------

CREATE TABLE machines (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    type            VARCHAR(50)     NOT NULL,
    initial_reading DECIMAL(12,2)   NOT NULL,
    status          VARCHAR(50)     NOT NULL,
    lock_status     VARCHAR(20)    DEFAULT 'open' CHECK (lock_status IN ('open', 'locked')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE readings (
    id              SERIAL PRIMARY KEY,
    machine_id      INTEGER         NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    product_id      INTEGER         REFERENCES products(id) ON DELETE CASCADE,
    price_id        INTEGER         REFERENCES prices(id) ON DELETE CASCADE,
    new_reading     DECIMAL(12,2)   NOT NULL,
    prev_reading    DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Dips
-- ---------------------------------------------------------------------------

CREATE TABLE dips (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      INTEGER         NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    prev_dip        DECIMAL(12,2)   NOT NULL,
    dip             DECIMAL(12,2)   NOT NULL,
    gain            DECIMAL(12,2)   DEFAULT 0,
    date            VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('locked', 'open')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Expenses & Wastage
-- ---------------------------------------------------------------------------

CREATE TABLE expenses (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100)    NOT NULL,
    description     TEXT,
    amount          DECIMAL(12,2)   NOT NULL,
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('locked', 'open')),
    date            VARCHAR(20)     NOT NULL,
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE wastages (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER         NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity        DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('open', 'locked')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Bank & Cash (cashier closing)
-- ---------------------------------------------------------------------------

CREATE TABLE cashier_closings (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bank_amount         DECIMAL(12,2)   NOT NULL,
    customer_debit_ids  JSONB,
    customer_credit_ids JSONB,
    customer_advance_ids JSONB,
    employee_debit_ids  JSONB,
    employee_credit_ids JSONB,
    expenses_ids        JSONB,
    stock_dip_ids       JSONB,
    status              VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('locked', 'open')),
    date                VARCHAR(20)     NOT NULL,
    created_on          TIMESTAMPTZ    DEFAULT NOW()
);

CREATE TABLE cashier_closing_items (
    id              SERIAL PRIMARY KEY,
    closing_id      INTEGER         NOT NULL REFERENCES cashier_closings(id) ON DELETE CASCADE,
    product_id      INTEGER REFERENCES products(id) ON DELETE SET NULL,
    price_id        INTEGER REFERENCES prices(id) ON DELETE SET NULL,
    prev_stock      DECIMAL(12,2),
    new_stock       DECIMAL(12,2),
    quantity        DECIMAL(12,2),
    test_entry      DECIMAL(12,2),
    readings        JSONB
);

CREATE TABLE banks (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_cash      DECIMAL(12,2)   DEFAULT 0,
    deposit_amount  DECIMAL(12,2)   DEFAULT 0,
    description     TEXT,
    status          VARCHAR(20)    DEFAULT 'pending' CHECK (status IN ('pending', 'deposited')),
    date            VARCHAR(20)     NOT NULL,
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE cashes (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    closing_id      INTEGER         NOT NULL REFERENCES cashier_closings(id) ON DELETE CASCADE,
    cash            DECIMAL(12,2)   DEFAULT 0,
    description     TEXT,
    status          VARCHAR(20)    DEFAULT 'pending' CHECK (status IN ('pending', 'collected')),
    collection_date VARCHAR(20),
    date            VARCHAR(20)     NOT NULL,
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Customer payments & advances
-- ---------------------------------------------------------------------------

CREATE TABLE customer_payments (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_id     INTEGER         NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    prev_amount     DECIMAL(12,2)   NOT NULL,
    paying_amount   DECIMAL(12,2)   NOT NULL,
    rem_amount      DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('locked', 'open')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE customer_advances (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_id     INTEGER         NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    description     VARCHAR(255)   NOT NULL,
    amount          DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('locked', 'open')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Supplier payments
-- ---------------------------------------------------------------------------

CREATE TABLE supplier_payments (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supplier_id     INTEGER         NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    prev_amount     DECIMAL(12,2)   NOT NULL,
    amount          DECIMAL(12,2)   NOT NULL,
    rem_amount      DECIMAL(12,2)   NOT NULL,
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('locked', 'open')),
    date            VARCHAR(20)     NOT NULL,
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Employee payments, salary, advances
-- ---------------------------------------------------------------------------

CREATE TABLE employee_payments (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id     INTEGER         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    amount          DECIMAL(12,2)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    prev_advance    DECIMAL(12,2),
    rem_advance     DECIMAL(12,2),
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('locked', 'open')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE employee_salaries (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id     INTEGER         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    net_salary      DECIMAL(12,2)   DEFAULT 0,
    salary_of_month VARCHAR(20),
    salary_of_year  VARCHAR(10),
    date            VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)    DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE employee_advances (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id     INTEGER         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    amount          DECIMAL(12,2)   DEFAULT 0,
    description     VARCHAR(255)   NOT NULL,
    date            VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)    DEFAULT 'open' CHECK (status IN ('locked', 'open')),
    created_on      TIMESTAMPTZ     DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Indexes for common lookups
-- ---------------------------------------------------------------------------

CREATE INDEX idx_customers_user_id    ON customers(user_id);
CREATE INDEX idx_sales_user_date      ON sales(user_id, date);
CREATE INDEX idx_sales_customer_id    ON sales(customer_id);
CREATE INDEX idx_purchases_supplier   ON purchases(supplier_id);
CREATE INDEX idx_purchases_date       ON purchases(date);
CREATE INDEX idx_prices_product_id    ON prices(product_id);
CREATE INDEX idx_readings_machine_id  ON readings(machine_id);
CREATE INDEX idx_dips_product_date    ON dips(product_id, date);

-- ---------------------------------------------------------------------------
-- Enable Row Level Security (RLS) - optional, enable if you use Supabase Auth
-- Then add policies per table as needed.
-- ---------------------------------------------------------------------------

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- etc.
