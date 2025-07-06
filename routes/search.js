const { Product } = require("../models/products");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
    try {

        const query = req.query.query;
        if (!query) {
            return res.status(500).json({ success: false, msg: "Query not found" });
        }

        const items = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { catName: { $regex: query, $options: "i" } },
                { subCatName: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } }
            ]
        })

        if (!items) {
            return res.status(500).json({ success: false, msg: "Items not found" });
        }

        return res.status(200).json(items);

    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.get(`/:id`, async (req, res) => {

    categoryEditId = req.params.id;

    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(500).json({ message: "Category ID not found" });
    }
    return res.status(201).send(category);
});


router.post('/create', async (req, res) => {

    const images_array = [];
    const uploadedImages = await ImageUpload.find();

    const images_Arr = uploadedImages?.map((item) => {
        item.images.map((image) => {
            images_array.push(image);
        })
    })

    let category = new Category({
        name: req.body.name,
        images: images_array,
        color: req.body.color
    });

    if (!category) {
        return res.status(500).json({
            error: "Category could not be created",
            success: false
        });
    }

    category = await category.save();

    imagesArray = [];

    res.status(201).json(category);

});

router.delete(`/deleteImage`, async (req, res) => {

    const imgUrl = req.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    const response = cloudinary.uploader.destroy(imageName, (error, result) => {

    });

    if (response) {
        res.status(200).send(response);
    }

});

router.delete(`/:id`, async (req, res) => {

    const category = await Category.findById(req.params.id);
    const images = category.images;

    for (img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];

        const imageName = image.split(".")[0];

        if (imageName) {
            cloudinary.uploader.destroy(imageName, (error, result) => {

            });
        }
    }

    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
        res.status(404).json({
            message: "Category ID not found",
            success: false
        });
    }
    res.status(200).json({
        message: "Category deleted successfully",
        success: true
    });
});

router.put("/:id", async (req, res) => {

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            images: imagesArray,
            color: req.body.color
        },
        { new: true }
    )

    if (!category) {
        return res.status(500).json({
            message: "Category ID not found",
            success: false
        })
    }

    imagesArray = [];
    return res.status(200).json(category);
});


module.exports = router;
