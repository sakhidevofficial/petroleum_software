const mongoose = require("mongoose");

const SubscriptionSchema = mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  startsAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endsAt: {
    type: Date,
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }, 
  createdOn: {
    type: Date,
    default: Date.now
  }
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
module.exports = Subscription;
