const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

const genReport = async (req, res) => {
  try {
    const dynamicData = {
      title: "Sales Report",
      reportData: { totalSales: 0, salesPerson: "Admin", date: new Date() },
    };
    return res.status(200).json({ success: true, data: dynamicData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { genReport };
