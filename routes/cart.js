const { Cart } = require("../models/cart");
const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const { checkUserStatus, requireAuth, requireAdminOrOwner } = require("../helper/authorization");

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

// Admin có thể xem tất cả cart, user chỉ xem cart của mình
router.get(`/`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        let query = req.query;

        // Nếu không phải admin, chỉ cho phép xem cart của chính mình
        if (!req.user.isAdmin) {
            query = { ...req.query, userId: req.auth.id };
        }

        const cartList = await Cart.find(query);

        if (!cartList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(cartList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.get('/:id', requireAuth, checkUserStatus, async (req, res) => {
    try {
        const cartList = await Cart.find({ userId: req.params.id });
        res.status(200).json(cartList);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.post('/add', async (req, res) => {
    try {
        // Check if item with same product, color and size already exists
        const cartItem = await Cart.find({
            productId: req.body.productId,
            userId: req.body.userId,
            productColor: req.body.productColor,
            productSize: req.body.productSize
        });

        if (cartItem.length === 0) {
            // Calculate total quantity and subtotal from classifications
            const classifications = req.body.classifications || [];
            const quantity = classifications.reduce((sum, cls) => sum + cls.quantity, 0);
            const subTotal = classifications.reduce((sum, cls) => sum + cls.subTotal, 0);

            let cartList = new Cart({
                productTitle: req.body.productTitle,
                images: req.body.images,
                rating: req.body.rating,
                price: req.body.price,
                quantity: quantity,
                subTotal: subTotal,
                productId: req.body.productId,
                userId: req.body.userId,
                productColor: req.body.productColor,
                productSize: req.body.productSize,
                inkmeFile: req.body.inkmeFile || null,
                classifications: classifications
            });

            cartList = await cartList.save();
            res.status(201).json(cartList);
        } else {
            return res.status(401).json({
                message: "Sản phẩm với màu sắc và kích thước này đã có trong giỏ hàng",
                status: false
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Cart could not be created" + error,
            success: false
        });
    }
});

router.post('/',  async (req, res) => {
    try {
        // Check if item with same product, color and size already exists
        const cartItem = await Cart.find({
            productId: req.body.productId,
            userId: req.body.userId,
            productColor: req.body.productColor,
            productSize: req.body.productSize
        });

        if (cartItem.length === 0) {
            // Calculate total quantity and subtotal from classifications
            const classifications = req.body.classifications || [];
            const quantity = classifications.reduce((sum, cls) => sum + cls.quantity, 0);
            const subTotal = classifications.reduce((sum, cls) => sum + cls.subTotal, 0);

            let cartList = new Cart({
                productTitle: req.body.productTitle,
                images: req.body.images,
                rating: req.body.rating,
                price: req.body.price,
                quantity: quantity,
                subTotal: subTotal,
                productId: req.body.productId,
                userId: req.body.userId,
                productColor: req.body.productColor,
                productSize: req.body.productSize,
                inkmeFile: req.body.inkmeFile || null,
                classifications: classifications
            });

            cartList = await cartList.save();
            res.status(201).json(cartList);
        } else {
            return res.status(401).json({
                message: "Sản phẩm với màu sắc và kích thước này đã có trong giỏ hàng",
                status: false
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Cart could not be created" + error,
            success: false
        });
    }
});

router.delete(`/:id`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        // Kiểm tra ownership - chỉ cho phép xóa cart của chính mình
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found",
                success: false
            });
        }

        // Admin có thể xóa bất kỳ cart nào, user chỉ xóa cart của mình
        if (!req.user.isAdmin && cartItem.userId !== req.auth.id) {
            return res.status(403).json({
                message: "Access denied. You can only delete your own cart items",
                success: false
            });
        }

        const deletedItem = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Cart deleted successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.put("/:id", requireAuth, checkUserStatus, async (req, res) => {
    try {
        // Kiểm tra ownership trước khi cập nhật
        const existingCart = await Cart.findById(req.params.id);
        if (!existingCart) {
            return res.status(404).json({
                message: "Cart item not found",
                success: false
            });
        }

        // Admin có thể cập nhật bất kỳ cart nào, user chỉ cập nhật cart của mình
        if (!req.user.isAdmin && existingCart.userId !== req.auth.id) {
            return res.status(403).json({
                message: "Access denied. You can only update your own cart items",
                success: false
            });
        }

        const classifications = req.body.classifications || [];

        // If no classifications remain, delete the cart item
        if (classifications.length === 0) {
            const deletedItem = await Cart.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                message: "Cart item deleted as no classifications remain",
                success: true
            });
        }

        // Calculate total quantity and subtotal from classifications
        const quantity = classifications.reduce((sum, cls) => sum + cls.quantity, 0);
        const subTotal = classifications.reduce((sum, cls) => sum + cls.subTotal, 0);

        const cartList = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                productTitle: req.body.productTitle,
                images: req.body.images,
                rating: req.body.rating,
                price: req.body.price,
                quantity: quantity,
                subTotal: subTotal,
                productId: req.body.productId,
                userId: req.body.userId,
                productColor: req.body.productColor,
                productSize: req.body.productSize,
                inkmeFile: req.body.inkmeFile || null,
                classifications: classifications
            },
            { new: true }
        );

        return res.status(200).send(cartList);
    } catch (error) {
        res.status(500).json({
            message: "Error updating cart item",
            success: false
        });
    }
});


module.exports = router;