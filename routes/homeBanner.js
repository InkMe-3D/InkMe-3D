const { HomeBanner } = require("../models/homeBanner");
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

// Chỉ admin mới được upload images cho home banner
router.post(`/upload`, requireAuth, checkUserStatus, requireAdmin, upload.array("images"), async (req, res) => {

    imagesArray = [];

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
        const totalPosts = await HomeBanner.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Không có dữ liệu" });
        }

        const HomeBannerList = await HomeBanner.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!HomeBannerList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({
            "HomeBannerList": HomeBannerList,
            "totalPages": totalPages,
            "page": page
        });

    } catch (error) {
        res.status(500).json({ success: false });
    }
});



// Chỉ admin mới được tạo home banner
router.post('/create', requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    // const images_array = [];
    // const uploadedImages = await ImageUpload.find();

    // const images_Arr = uploadedImages?.map((item) => {
    //     item.images.map((image) => {
    //         images_array.push(image);
    //     })
    // })

    let newEntry = new HomeBanner({
        images: imagesArray
    });

    if (!newEntry) {
        return res.status(500).json({
            error: "Images could not be created",
            success: false
        });
    }

    newEntry = await newEntry.save();

    imagesArray = [];

    res.status(201).json(newEntry);

});

// Chỉ admin mới được xóa image
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

// Chỉ admin mới được xóa home banner
router.delete(`/:id`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    const homeBanner = await HomeBanner.findById(req.params.id);
    const images = homeBanner.images;

    for (img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];

        const imageName = image.split(".")[0];

        cloudinary.uploader.destroy(imageName, (error, result) => {

        });

    }

    const deletedHomeBanner = await HomeBanner.findByIdAndDelete(req.params.id);
    if (!deletedHomeBanner) {
        res.status(404).json({
            message: "HomeBannerID not found",
            success: false
        });
    }
    res.status(200).json({
        message: "HomeBanner deleted successfully",
        success: true
    });
});

// Chỉ admin mới được cập nhật home banner
router.put("/:id", requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    const homeBanner = await HomeBanner.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesArray
        },
        { new: true }
    )

    if (!homeBanner) {
        return res.status(500).json({
            message: "HomeBanner ID not found",
            success: false
        })
    }

    imagesArray = [];
    return res.status(200).send(homeBanner);
});


module.exports = router;
