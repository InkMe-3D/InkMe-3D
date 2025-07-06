const mongoose = require("mongoose");

const recentlyProductsSchema = mongoose.Schema({
    prodId:{
        type: String,
        default: ""
    },
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
    productRams: [
        {
            type: String,
            default: null
        }
    ],
    productSize: [
        {
            type: String,
            default: null
        }
    ],
    productWeight: {
        type: Number,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

recentlyProductsSchema.virtual("id").get(function () {
    return this._id.toHexString();
})

recentlyProductsSchema.set("toJSON", {
    virtuals: true
});

exports.RecentlyProducts = mongoose.model("RecentlyProducts", recentlyProductsSchema);
