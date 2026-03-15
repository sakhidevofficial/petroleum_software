const config = require("config");
const axios = require("axios");
const pp_MerchantID = config.get("jazzcashMerchantId");
const pp_Password = config.get("jazzcashPassword");
const pp_Integrity = config.get("integritySalt");
const jazzcashPostURL = config.get("jazzcashHttpPostUrl");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

//Add Purchase Plan Method
const addPurPlan = async (req, res) => {
  //Get Validation errors from express validator
  const errors = validationResult(req);

  //Send validation errors if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Extract Values from req
    const { Phone, Cnic, PlanPrice, PlanId } = req.body;

    const date = new Date();

    //Start Time
    let dateTime =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    //Creating expiry time
    date.setHours(date.getHours() + 1);

    let expDateTime =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    //Removing Decimal Places from Price
    let newPrice = PlanPrice * 100;

    //Creating Reference Number
    let RefNo = "T" + dateTime;

    let jazzcashData = {
      pp_Language: "EN",
      pp_MerchantID: pp_MerchantID,
      pp_Password: pp_Password,
      pp_TxnRefNo: RefNo,
      pp_MobileNumber: Phone,
      pp_CNIC: Cnic,
      pp_Amount: newPrice,
      pp_ReturnURL: "http://localhost/api/purplans",
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: dateTime,
      pp_BillReference: "billRef",
      pp_Description: "Description",
      pp_TxnExpiryDateTime: expDateTime,
      pp_SecureHash: "",
      ppmpf_1: Phone,
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
    };

    console.log(jazzcashData)
    // let keys = Object.keys(jazzcashData).sort();

    // //Creating secure hash function
    // const secureHash = (dataObject) => {
    //   const data = dataObject.filter(([key, value]) => value !== "");
    //   let str = "";
    //   data.forEach((item) => {
    //     str = str + "&" + jazzcashData[item];
    //   });
    //   str = pp_Integrity + str;

    //   console.log(str);
    //   // create a new HMAC with the salt
    //   let hmac = crypto.createHmac("sha256", pp_Integrity);

    //   // update the HMAC with the data to be hashed
    //   hmac.update(str);

    //   // calculate the digest
    //   let digest = hmac.digest("hex");
    //   // const hash = crypto.createHash("sha256").update(str).digest("hex");
    //   return digest;
    // };
    // const securHash = secureHash(keys);

    // let sortedObject = {};
    // keys.forEach(function (key) {
    //   sortedObject[key] = jazzcashData[key];
    // });

    // sortedObject.pp_SecureHash = securHash;
    // console.log(sortedObject);

    // const callApi = async (data) => {
    //   console.log(data);
    //   await axios
    //     .post(
    //       "https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction",
    //       data
    //     )
    //     .then((response) => {
    //       console.log(response.data);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // };

    // const sendReq = callApi(sortedObject);
    // console.log(sendReq);
    // res.status(201).json({
    //   msg: "Request received successful",
    //   data: { start: dateTime, end: expDateTime },
    //   price: newPrice,
    //   refNo: RefNo,
    //   hash: sendReq,
    // });
  } catch (error) {}
};
module.exports = { addPurPlan };
