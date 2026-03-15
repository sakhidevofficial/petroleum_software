const mongoose = require("mongoose");

const TenantSchema = mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  tenantName: {
    type: String,
    minLength: 3,
    maxLength: 50,
    lowercase: true
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
    lowercase: true
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "deactive"]
    
  },
  logo: {
    type: String
  },
  date: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

const Tenant = mongoose.model("Tenant", TenantSchema);
module.exports = Tenant;
