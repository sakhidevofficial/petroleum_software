import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import { Receipt } from "@mui/icons-material";
import GridForm from "../../Components/form/GridForm";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  clearReports,
  getCustomerReports,
  getPrintCustomerReport,
  getPrintMonthlyReport,
} from "../../redux/reportSlice/reportSlice";
import { DOMAIN } from "../../backend/API";
import "./style.scss";
import { getAllActiveCustomers } from "../../redux/completeDataSlice/completeDataSlice";
import { clearCustomers } from "../../redux/customerSlice/customerSlice";

// SEARCH FORM FIELDS
const searchReportInput = (printReport, customers) => [
  {
    id: 1,
    label: "Customer",
    type: "select",
    name: "customerId",
    options: customers.map((item) => ({
      id: item._id,
      name: item.name,
      value: item._id,
      avatarUrl: `${DOMAIN}/public/customers/images/${item.pic}`,
      avatarAlt: "./img/avatarfile.png",
      salary: item?.balance?.toLocaleString("en-US", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    })),
    grid: { xs: 12, sm: 12, md: 12, lg: 12 },
  },
  {
    id: 2,
    label: "Start Date",
    type: "date",
    name: "startDate",
    grid: { xs: 12, sm: 4 },
  },
  {
    id: 3,
    label: "End Date",
    type: "date",
    name: "endDate",
    grid: { xs: 12, sm: 4 },
  },
  {
    id: 4,
    label: "Filter",
    type: "button",
    btntype: "submit",
    variant: "contained",
    color: "primary",
    grid: { xs: 12, sm: 2 },
  },
  {
    id: 5,
    label: "Print",
    type: "button",
    btntype: "button",
    variant: "contained",
    btnFunc: printReport,
    color: "primary",
    grid: { xs: 12, sm: 2 },
  },
];

export default function CustomerReport() {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.customerReports);
  const customers = useSelector((state) => state.completeData.customers);

  const [state, setState] = useState({
    customerId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getAllActiveCustomers());
    return () => {
      dispatch(clearCustomers());
      dispatch(clearReports());
    };
  }, [dispatch]);

  const printReport = async () => {
    const { customerId, startDate, endDate } = state;
    if (!customerId && !startDate && !endDate) {
      return toast("Please select date first", { type: "error" });
    }

    const newData = {
      customerId,
      startDate: startDate || endDate,
      endDate: endDate || startDate,
    };
    dispatch(getPrintCustomerReport(newData));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const { customerId, startDate, endDate } = state;

    if (!customerId) {
      return toast("Please Select the Customer", { type: "error" });
    }

    if (!startDate && !endDate) {
      return toast("Please select date first", { type: "error" });
    }

    const newData = {
      customerId,
      startDate: startDate || endDate,
      endDate: endDate || startDate,
    };

    dispatch(getCustomerReports(newData));
  };

  const data = reports?.[0];
  const customer = data?.customer;

  const creditRecords = data?.credits?.records || [];
  const creditTotal = data?.credits?.grandTotal || 0;
  const lastCredit = data?.lastAmount || 0;

  const paymentRecords = data?.payments?.records || [];
  const paymentTotal = data?.payments?.grandTotal || 0;

  const advanceRecords = data?.advances || [];
  const advanceTotal = data?.advances?.grandTotal || 0;

  const totalCredit = creditTotal + advanceTotal;
  const remaining = lastCredit + totalCredit - paymentTotal;

  return (
    <Box m="0px 20px 20px 20px">
      <Header
        title="Customer Reports"
        subTitle="Generate Statement or Report"
        icon={<Receipt />}
      />
      <Box sx={{ paddingLeft: 3, paddingRight: 3 }}>
        <GridForm
          inputs={searchReportInput(printReport, customers)}
          state={state}
          setState={setState}
          submit={handleOnSubmit}
        />
      </Box>

      {data && (
        <div className="report-wrapper">
          <div className="report-card">
            <h1 className="main-title">Customer Statement</h1>

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <h4>Customer Name: {customer?.name}</h4>
              <h4>
                Current Credit:{" "}
                {customer?.balance?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "PKR",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h4>
            </div>

            <hr />

            {/* CREDIT SECTION */}
            <div className="section red" style={{ marginTop: 30 }}>
              <h2 className="section-title">Customer Credit</h2>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {creditRecords.map((item, i) => (
                    <tr key={i}>
                      <td>{item.productName}</td>
                      <td>{item.description}</td>
                      <td>{item.date}</td>
                      <td>
                        {item.amount?.toLocaleString("en-US", {
                          style: "currency",
                          currency: "PKR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                  <tr className="bold-row">
                    <td colSpan={3}>Total Amount</td>
                    <td>
                      {creditTotal.toLocaleString("en-US", {
                        style: "currency",
                        currency: "PKR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ADVANCE / DEBIT SECTION */}
            <div className="section blue">
              <h2 className="section-title">Advance - Debit</h2>
              <table
                className="styled-table full"
                style={{ marginTop: "20px" }}
              >
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Debit</th>
                    <th>Date</th>
                    <th>Advance</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const maxLength = Math.max(
                      paymentRecords.length,
                      advanceRecords.length
                    );
                    const rows = [];
                    for (let i = 0; i < maxLength; i++) {
                      const payment = paymentRecords[i];
                      const advance = advanceRecords[i];

                      rows.push(
                        <tr key={i}>
                          <td>{payment?.date || "-"}</td>
                          <td>
                            {payment?.payingAmount?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "-"}
                          </td>
                          <td>{advance?.date || "-"}</td>
                          <td>
                            {advance?.amount?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PKR",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "-"}
                          </td>
                        </tr>
                      );
                    }

                    rows.push(
                      <tr key="totals" className="bold-row">
                        <td>Totals</td>
                        <td>
                          {paymentTotal.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>Totals</td>
                        <td>
                          {advanceTotal.toLocaleString("en-US", {
                            style: "currency",
                            currency: "PKR",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    );

                    return rows;
                  })()}
                </tbody>
              </table>
            </div>

            {/* SUMMARY SECTION */}
            <div className="section green">
              <h2 className="section-title">Summary</h2>
              <div className="summary-box">
                <table className="styled-table" style={{ maxWidth: "400px" }}>
                  <tbody>
                    <tr>
                      <td>Credit</td>
                      <td>{creditTotal}</td>
                    </tr>
                    <tr>
                      <td>Advance</td>
                      <td>{advanceTotal}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Total Credit</strong>
                      </td>
                      <td>
                        <strong>{totalCredit}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Last Credit</strong>
                      </td>
                      <td>
                        <strong>{lastCredit}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Debit</td>
                      <td>{paymentTotal}</td>
                    </tr>
                    <tr className="bold-row green-text">
                      <td>Remaining</td>
                      <td>{remaining}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
}
