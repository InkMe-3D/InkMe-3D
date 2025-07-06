const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    productTitle: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            default: ''
        }
    ],
    rating: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    productColor: {
        type: String,
        required: true
    },
    productSize: {
        type: String,
        required: true
    },
    inkmeFile: {
        url: {
            type: String,
            required: false
        },
        sceneName: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: false
        },
        bgColor: {
            type: String,
            required: false
        },
        acidWash: {
            type: Number,
            required: false,
            default: 0
        },
        puffPrint: {
            type: Number,
            required: false,
            default: 0
        },
        timestamp: {
            type: String,
            required: false
        }
    },
    classifications: [
        {
            name: {
                type: String,
                required: true
            },
            image: {
                type: String,
                default: ''
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            subTotal: {
                type: Number,
                required: true
            }
        }
    ]
});

cartSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

cartSchema.set("toJSON", {
    virtuals: true
});

exports.Cart = mongoose.model("Cart", cartSchema);
exports.cartSchema = cartSchema;