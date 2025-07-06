const { ProductReviews } = require("../models/productReviews")
const express = require("express");
const router = express.Router();
const { checkUserStatus, requireAuth, requireAdmin } = require("../helper/authorization");

router.get(`/`, async (req, res) => {

    let reviews = [];

    try {
        if (req.query.productId !== undefined && req.query.productId !== null && req.query.productId !== "") {
            reviews = await ProductReviews.find({ productId: req.query.productId });
        } else {
            reviews = await ProductReviews.find();
        }

        if (!reviews) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.get(`/:id`, async (req, res) => {

    const review = await ProductReviews.findById(req.params.id);

    if (!review) {
        res.status(404).json({
            message: "Product Review ID not found",
            success: false
        });
    }
    res.status(200).send(review);
});

// User đã login có thể thêm review
router.post(`/add`, requireAuth, checkUserStatus, async (req, res) => {

    let review = new ProductReviews({
        productId: req.body.productId,
        customerId: req.body.customerId,
        customerName: req.body.customerName,
        review: req.body.review,
        customerRating: req.body.customerRating
    });

    if (!review) {
        return res.status(500).json({
            error: "Product Review could not be created",
            success: false
        });
    }

    review = await review.save();

    return res.status(201).json(review);
});

module.exports = router;