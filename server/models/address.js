const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // New address fields with API data
    province: {
        type: String,
        required: false // Optional for backward compatibility
    },
    provinceName: {
        type: String,
        required: false
    },
    district: {
        type: String,
        required: false
    },
    districtName: {
        type: String,
        required: false
    },
    ward: {
        type: String,
        required: false
    },
    wardName: {
        type: String,
        required: false
    },
    // Keep city for backward compatibility
    city: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    moreInfo: {
        type: String,
        default: ""
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

addressSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

addressSchema.set("toJSON", {
    virtuals: true,
});

exports.Address = mongoose.model("Address", addressSchema);
exports.addressSchema = addressSchema; 