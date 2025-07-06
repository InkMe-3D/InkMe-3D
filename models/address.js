const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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