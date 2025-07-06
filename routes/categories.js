const { Category } = require("../models/category");
const { ImageUpload } = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { checkUserStatus, requireAuth, requireAdmin } = require("../helper/authorization");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

// ------------ img upload

var imagesArray = [];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
})

const upload = multer({
    storage: storage
})

// Chỉ admin mới được upload images cho category
router.post(`/upload`, requireAuth, checkUserStatus, requireAdmin, upload.array("images"), async (req, res) => {

    imagesArray = [];
    console.log("Received files:", req.files); // Kiểm tra req.files
    console.log("Request body:", req.body); // Kiểm tra req.body


    try {
        for (let i = 0; i < req.files.length; i++) {

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            const img = await cloudinary.uploader.upload(req.files[i].path, options, function (error, result) {
                imagesArray.push(result.secure_url);
                fs.unlinkSync(`uploads/${req.files[i].filename}`);
            });
        }

        let imagesUploaded = new ImageUpload({
            images: imagesArray
        });

        imagesUploaded = await imagesUploaded.save();
        return res.status(200).json(imagesArray);

    }
    catch (err) {
        console.log(err);
    }

});

// ------------ img upload


router.get(`/`, async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const totalPosts = await Category.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Không có dữ liệu" });
        }

        const categoryList = await Category.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!categoryList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({
            "categoryList": categoryList,
            "totalPages": totalPages,
            "page": page
        });

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


// Chỉ admin mới được tạo category mới
router.post('/create', requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

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

// Chỉ admin mới được xóa image category
router.delete(`/deleteImage`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    const imgUrl = req.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    const response = await cloudinary.uploader.destroy(imageName, (error, result) => {

    });

    if (response) {
        res.status(200).send(response);
    }

});

// Chỉ admin mới được xóa category
router.delete(`/:id`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

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

// Chỉ admin mới được cập nhật category
router.put("/:id", requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

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
