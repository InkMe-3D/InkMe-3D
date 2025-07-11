const { Category } = require("../models/category");
const { Product } = require("../models/products");
const { RecentlyProducts } = require("../models/recentlyProducts");
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
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// Chỉ admin mới được upload images cho sản phẩm
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

// ------------ end img upload

// ------------ upload single
const uploadSingle = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
}).single("file"); // field name = file

router.post("/upload-file", (req, res) => {

    try {
        const bodyData = [];

        req.on('data', chunk => {
            bodyData.push(chunk);
        });

        req.on('end', () => {

            try {
                // Create a simple filename
                const randomString = Math.random().toString(36).substring(2, 7);
                const filename = `${Date.now()}_${randomString}_layout.sav`;
                const filePath = `uploads/${filename}`;

                // Save to local file
                const fs = require('fs');
                const fullData = Buffer.concat(bodyData);

                // Extract JSON from multipart data (simple approach)
                const dataStr = fullData.toString();
                const jsonMatch = dataStr.match(/\r\n\r\n(.*?)\r\n/s);

                if (jsonMatch && jsonMatch[1]) {
                    const jsonData = jsonMatch[1];

                    // Upload directly to Cloudinary without saving locally
                    uploadJSONToCloudinary(jsonData, filename)
                        .then(cloudinaryResult => {

                            return res.status(200).json({
                                url: cloudinaryResult.secure_url,
                                public_id: cloudinaryResult.public_id,
                                filename: filename,
                                cloudinary: true,
                                bytes: cloudinaryResult.bytes
                            });
                        })
                        .catch(cloudinaryError => {
                            console.log("Cloudinary upload failed:", cloudinaryError.message);

                            // Only create local file as emergency fallback
                            try {
                                fs.writeFileSync(filePath, jsonData);
                                const localUrl = `${process.env.VITE_APP_BASE_URL}/uploads/${filename}`;

                                return res.status(200).json({
                                    url: localUrl,
                                    filename: filename,
                                    cloudinary: false,
                                    cloudinary_error: cloudinaryError.message
                                });
                            } catch (localError) {
                                return res.status(500).json({
                                    error: "Upload failed completely",
                                    cloudinary_error: cloudinaryError.message,
                                    local_error: localError.message
                                });
                            }
                        });
                } else {
                    return res.status(400).json({ error: "Invalid data format" });
                }

            } catch (parseError) {
                return res.status(500).json({ error: "Parse error", details: parseError.message });
            }
        });

        req.on('error', (error) => {
            if (!res.headersSent) {
                res.status(500).json({ error: "Request error", details: error.message });
            }
        });

    } catch (globalError) {
        if (!res.headersSent) {
            res.status(500).json({ error: "Global error", details: globalError.message });
        }
    }
});

// ------------ end upload single

// Helper function to upload JSON data directly to Cloudinary
async function uploadJSONToCloudinary(jsonData, filename) {
    return new Promise((resolve, reject) => {
        // Set a timeout for the upload
        const uploadTimeout = setTimeout(() => {
            reject(new Error('Cloudinary upload timeout after 30 seconds'));
        }, 30000);

        // Create a buffer from JSON data
        const buffer = Buffer.from(jsonData, 'utf8');

        // Upload buffer directly to Cloudinary
        cloudinary.uploader.upload_stream({
            resource_type: "raw",
            format: "sav",
            public_id: filename,
            folder: "inkme_layouts",
            overwrite: true
        }, (error, result) => {
            clearTimeout(uploadTimeout);

            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        }).end(buffer);
    });
}



router.get(`/`, async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const totalPosts = await Product.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);
        const sort = req.query.sort || 'menu_order'; // Mặc định sắp xếp theo menu_order

        // Xác định tiêu chí sắp xếp
        let sortOption = {};
        switch (sort) {
            case 'menu_order':
                sortOption = { _id: 1 }; // Sắp xếp mặc định theo _id
                break;
            case 'popularity':
                sortOption = { quantitySold: -1 }; // Bán nhiều nhất trước
                break;
            case 'rating':
                sortOption = { rating: -1 }; // Đánh giá cao nhất trước
                break;
            case 'date':
                sortOption = { dateCreated: -1 }; // Mới nhất trước
                break;
            case 'price':
                sortOption = { price: 1 }; // Giá thấp đến cao
                break;
            case 'price-desc':
                sortOption = { price: -1 }; // Giá cao đến thấp
                break;
            case 'discount':
                sortOption = { discount: -1 }; // Giảm giá cao nhất trước
                break;
            case 'stock':
                sortOption = { countInStock: -1 }; // Tồn kho nhiều nhất trước
                break;
            default:
                sortOption = { _id: 1 }; // Mặc định
        }

        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        let productList = [];

        if (req.query.minPrice !== undefined && req.query.maxPrice !== undefined) {
            productList = await Product.find({ subCatId: req.query.subCatId }).populate("category subCat").sort(sortOption);

            const filteredProducts = productList.filter(product => {
                if (req.query.minPrice && product.oldPrice < parseInt(+req.query.minPrice)) {
                    return false;
                }
                if (req.query.maxPrice && product.oldPrice > parseInt(+req.query.maxPrice)) {
                    return false;
                }
                return true;
            });

            if (!productList) {
                res.status(500).json({ success: false });
            }

            return res.status(200).json({
                "products": filteredProducts,
                "totalPages": totalPages,
                "page": page
            });

        } else if (req.query.page !== undefined && req.query.perPage !== undefined) {

            productList = await Product.find(req.query).populate("category subCat").skip((page - 1) * perPage).sort(sortOption).limit(perPage).exec();

            if (!productList) {
                res.status(500).json({ success: false });
            }

            return res.status(200).json({
                "products": productList,
                "totalPages": totalPages,
                "page": page
            });
        } else {
            productList = await Product.find(req.query).populate("category subCat").sort(sortOption);

            if (!productList) {
                res.status(500).json({ success: false });
            }

            return res.status(200).json({
                "products": productList,
                "totalPages": totalPages,
                "page": page
            });
        }

    } catch (error) {
        res.status(500).json({ success: false });
    }
});



router.get(`/featured`, async (req, res) => {
    const productList = await Product.find({ isFeatured: true });

    if (!productList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json(productList);

});



// Chỉ admin mới được tạo sản phẩm mới
router.post(`/create`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(404).send("Invalid Category");
    }

    const images_array = [];
    const uploadedImages = await ImageUpload.find();

    const images_Arr = uploadedImages?.map((item) => {
        item.images.map((image) => {
            images_array.push(image);
        })
    })
    images_Arr();

    // Xử lý productClassify từ JSON string
    let productClassify = [];
    if (req.body.productClassify) {
        try {
            productClassify = JSON.parse(req.body.productClassify);
        } catch (error) {
            console.log("Error parsing productClassify:", error);
            productClassify = [];
        }
    }

    // Xử lý productSize và productColor từ string hoặc array
    let productSize = [];
    if (req.body.productSize) {
        productSize = Array.isArray(req.body.productSize)
            ? req.body.productSize
            : req.body.productSize.split(',');
    }

    let productColor = [];
    if (req.body.productColor) {
        productColor = Array.isArray(req.body.productColor)
            ? req.body.productColor
            : req.body.productColor.split(',');
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: images_array,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        catName: req.body.catName,
        subCatId: req.body.subCatId,
        category: req.body.category,
        discount: req.body.discount,
        subCat: req.body.subCat,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        productSize: productSize,
        productColor: productColor,
        productWeight: req.body.productWeight || 0,
        productClassify: productClassify,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();
    if (!product) {
        res.status(500).json({
            error: "Product could not be created",
            success: false
        })

    }

    imagesArray = [];

    return res.status(201).json(product);
});

router.get(`/recentlyProducts`, async (req, res) => {
    let productList = [];
    productList = await RecentlyProducts.find(req.query).populate("category subCat");
    if (!productList) {
        res.status(500).json({ success: false });
    }

    return res.status(200).json(productList);
});

// User đã login có thể thêm sản phẩm vào recently viewed
router.post(`/recentlyProducts`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        let findProduct = await RecentlyProducts.findOne({ prodId: req.body.id });

        var product;

        if (!findProduct) {
            product = new RecentlyProducts({
                prodId: req.body.id,
                name: req.body.name,
                description: req.body.description,
                images: req.body.images,
                brand: req.body.brand,
                price: req.body.price,
                oldPrice: req.body.oldPrice,
                catName: req.body.catName,
                subCatId: req.body.subCatId,
                category: req.body.category,
                discount: req.body.discount,
                subCat: req.body.subCat,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                productSize: req.body.productSize,
                productWeight: req.body.productWeight,
                isFeatured: req.body.isFeatured,
            });

            product = await product.save();
            return res.status(201).json(product);
        }

        return res.status(200).json({ message: "Product already exists", product: findProduct });
    } catch (error) {
        return res.status(500).json({ error: error.message, success: false });
    }
});


router.get(`/:id`, async (req, res) => {

    const productEditId = req.params.id;

    try {
        const product = await Product.findById(productEditId).populate("category subCat");

        if (!product) {
            return res.status(500).json({ message: "Product ID not found" });  // Dừng xử lý ngay tại đây
        }

        return res.status(200).send(product);  // Gửi phản hồi nếu tìm thấy sản phẩm
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});


// Chỉ admin mới được xóa image
router.delete(`/deleteImage`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

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

// Chỉ admin mới được xóa sản phẩm
router.delete(`/:id`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    const product = await Product.findById(req.params.id);
    const images = product.images;

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

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
        res.status(404).json({
            message: "Product ID not found",
            success: false
        });
    }
    res.status(200).json({
        message: "Product deleted successfully",
        success: true
    });

});


// Chỉ admin mới được cập nhật sản phẩm
router.put(`/:id`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {

    // Xử lý productClassify từ JSON string
    let productClassify = [];
    if (req.body.productClassify) {
        try {
            productClassify = typeof req.body.productClassify === 'string'
                ? JSON.parse(req.body.productClassify)
                : req.body.productClassify;
        } catch (error) {
            console.log("Error parsing productClassify:", error);
            productClassify = [];
        }
    }

    // Xử lý productSize và productColor từ string hoặc array
    let productSize = [];
    if (req.body.productSize) {
        productSize = Array.isArray(req.body.productSize)
            ? req.body.productSize
            : req.body.productSize.split(',');
    }

    let productColor = [];
    if (req.body.productColor) {
        productColor = Array.isArray(req.body.productColor)
            ? req.body.productColor
            : req.body.productColor.split(',');
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            discount: req.body.discount,
            catName: req.body.catName,
            subCatId: req.body.subCatId,
            category: req.body.category,
            subCat: req.body.subCat,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            productSize: productSize,
            productColor: productColor,
            productWeight: req.body.productWeight || 0,
            productClassify: productClassify,
            isFeatured: req.body.isFeatured
        },
        {
            new: true
        }
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            status: false
        });
    }

    res.status(200).send({
        message: "Product updated successfully",
        status: true
    });
});

router.get('/category/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const products = await Product.find({ category: categoryId }).populate('category subCat');
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }
        return res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router