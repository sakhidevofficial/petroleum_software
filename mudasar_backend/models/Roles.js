const mongoose = require("mongoose")


//Create Roles Schema
const RolesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    features: [
        {
            featureId: mongoose.Schema.Types.ObjectId,
            read: {
                type: Boolean,
                default: true
            },
            write: {
                type: Boolean,
                default: true
            },
            update: {
                type: Boolean,
                default: true
            },
            delete: {
                type: Boolean,
                default: true
            }
        }
    ]
})

//Export Roles Schema
const Role = mongoose.model("Role", RolesSchema)
module.exports = Role