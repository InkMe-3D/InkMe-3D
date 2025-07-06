const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    brand: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    catName: {
        type: String,
        default: ""
    },
    subCatId: {
        type: String,
        default: ""
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    quantitySold: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        required: true
    },
    productClassify: [
        {
            image: {
                type: String,
                default: null
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                default: 0,
                min: 0
            },
            price: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    productSize: [
        {
            type: String,
            default: null
        }
    ],
    productColor: [
        {
            type: String,
            default: null
        }
    ],
    productWeight: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

productSchema.virtual("id").get(function () {
    return this._id.toHexString();
})

productSchema.set("toJSON", {
    virtuals: true
});

exports.Product = mongoose.model("Product", productSchema);
exports.productSchema = productSchema;
