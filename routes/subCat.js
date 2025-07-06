const { subCategory } = require("../models/subCat");
const express = require("express");
const router = express.Router();
const { checkUserStatus, requireAuth, requireAdmin } = require("../helper/authorization");

router.get(`/`, async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const totalPosts = await subCategory.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        let subCategoryList = [];

        if (page > totalPages) {
            return res.status(404).json({ message: "Không có dữ liệu" });
        }

        if (req.query.page !== undefined && req.query.perPage !== undefined) {
            subCategoryList = await subCategory.find().populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
        } else {
            subCategoryList = await subCategory.find().populate("category");
        }

        if (!subCategoryList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({
            "subCategoryList": subCategoryList,
            "totalPages": totalPages,
            "page": page
        });

    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.get(`/:id`, async (req, res) => {

    const subCat = await subCategory.findById(req.params.id).populate("category");
    if (!subCat) {
        res.status(500).json({ message: "Sub Category ID not found" });
    }
    return res.status(201).send(subCat);
});

// Chỉ admin mới được tạo sub category
router.post('/create', requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    let subCat = new subCategory({
        category: req.body.category,
        subCat: req.body.subCat,
    });

    if (!subCat) {
        return res.status(500).json({
            error: "Sub Category could not be created",
            success: false
        });
    }

    subCat = await subCat.save();

    res.status(201).json(subCat);

});

// Chỉ admin mới được xóa sub category
router.delete(`/:id`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    const deletedSubCategory = await subCategory.findByIdAndDelete(req.params.id);
    if (!deletedSubCategory) {
        res.status(404).json({
            message: "Sub Category ID not found",
            success: false
        });
    }
    res.status(200).json({
        message: "Sub Category deleted successfully",
        success: true
    });
});

// Chỉ admin mới được cập nhật sub category
router.put('/:id', requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    const subCat = await subCategory.findByIdAndUpdate(
        req.params.id,
        {
            category: req.body.category,
            subCat: req.body.subCat
        },
        { new: true }
    )

    if (!subCat) {
        return res.status(500).json({
            message: "Sub Category ID not found",
            success: false
        })
    }

    return res.status(200).json(subCat);

});


module.exports = router;