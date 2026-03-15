const pool = require("./pool");

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Supabase PostgreSQL connected...");
    client.release();
  } catch (err) {
    console.error("Database connection error:", err.message || err.code || JSON.stringify(err));
    console.error("Full error:", err);
    console.warn("Server will continue running but database queries may fail.");
  }
};

module.exports = connectDB;
