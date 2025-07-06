const { Orders } = require("../models/orders");
const { User } = require("../models/user");
const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const { checkUserStatus, requireAuth, requireAdmin, requireAdminOrOwner } = require("../helper/authorization");

// Chỉ admin có thể xem tất cả orders
router.get(`/`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const totalPosts = await Orders.countDocuments();
        const totalPages = Math.max(1, Math.ceil(totalPosts / perPage));

        const ordersList = await Orders.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        return res.status(200).json({
            ordersList: ordersList,
            totalPages: totalPages,
            page: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post(`/create`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        const {
            address,
            note,
            amount,
            products,
            orderId,
            userId,
            orderType,
            orderDescription,
            status = "Unpaid",
        } = req.body;

        // Validate userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // Validate products
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Products array is required and cannot be empty",
            });
        }

        // Hàm so sánh sâu 2 mảng classifications
        function isSameClassifications(arr1, arr2) {
            if (!Array.isArray(arr1) && !Array.isArray(arr2)) return true;
            if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
            if (arr1.length !== arr2.length) return false;
            const sorted1 = [...arr1].sort((a, b) => a._id.localeCompare(b._id));
            const sorted2 = [...arr2].sort((a, b) => a._id.localeCompare(b._id));
            for (let i = 0; i < sorted1.length; i++) {
                if (
                    sorted1[i]._id !== sorted2[i]._id ||
                    sorted1[i].name !== sorted2[i].name ||
                    sorted1[i].image !== sorted2[i].image ||
                    sorted1[i].price !== sorted2[i].price ||
                    sorted1[i].quantity !== sorted2[i].quantity ||
                    sorted1[i].subTotal !== sorted2[i].subTotal
                ) {
                    return false;
                }
            }
            return true;
        }

        // Hàm so sánh sâu 2 mảng sản phẩm
        function isSameProducts(arr1, arr2) {
            if (arr1.length !== arr2.length) return false;
            const sorted1 = [...arr1].sort((a, b) => a.productId.localeCompare(b.productId));
            const sorted2 = [...arr2].sort((a, b) => a.productId.localeCompare(b.productId));
            for (let i = 0; i < sorted1.length; i++) {
                if (
                    sorted1[i].productId !== sorted2[i].productId ||
                    sorted1[i].productTitle !== sorted2[i].productTitle ||
                    sorted1[i].quantity !== sorted2[i].quantity ||
                    sorted1[i].price !== sorted2[i].price ||
                    sorted1[i].subTotal !== sorted2[i].subTotal ||
                    JSON.stringify(sorted1[i].images || []) !== JSON.stringify(sorted2[i].images || []) ||
                    !isSameClassifications(sorted1[i].classifications || [], sorted2[i].classifications || [])
                ) {
                    return false;
                }
            }
            return true;
        }

        // Hàm so sánh sâu toàn bộ order
        function isSameOrder(orderA, orderB) {
            if (
                orderA.orderDescription !== orderB.orderDescription ||
                orderA.orderType !== orderB.orderType ||
                Number(orderA.amount) !== Number(orderB.amount) ||
                String(orderA.userId) !== String(orderB.userId) ||
                String(orderA.address) !== String(orderB.address) ||
                orderA.note !== orderB.note ||
                orderA.status !== orderB.status
            ) {
                return false;
            }
            if (!isSameProducts(orderA.products, orderB.products)) {
                return false;
            }
            return true;
        }

        // Tìm order trùng
        const existingOrders = await Orders.find({
            userId,
            status: "Unpaid"
        });

        let foundOrder = null;
        for (const order of existingOrders) {
            if (isSameOrder(order, {
                orderDescription,
                orderType,
                amount,
                userId,
                address,
                note,
                products,
                status: status || "Unpaid"
            })) {
                foundOrder = order;
                break;
            }
        }

        if (foundOrder) {
            foundOrder.updatedAt = Date.now();
            await foundOrder.save();
            return res.status(200).json(foundOrder);
        }

        // Nếu không trùng, tạo order mới
        const order = new Orders({
            address,
            note,
            amount,
            products,
            orderId,
            userId,
            orderType,
            orderDescription,
            status: status || "Unpaid",
        });

        const savedOrder = await order.save();
        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Order could not be created",
            details: error.message,
        });
    }
});

// Admin hoặc owner có thể xem order chi tiết
router.get(`/:id`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order ID not found" });
        }

        // Admin có thể xem tất cả orders, user chỉ xem order của mình
        if (!req.user.isAdmin && order.userId.toString() !== req.auth.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only view your own orders"
            });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin hoặc chính user đó có thể xem orders của user
router.get(`/user/:userId`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        // Admin có thể xem orders của bất kỳ user nào, user chỉ xem orders của mình
        if (!req.user.isAdmin && req.params.userId !== req.auth.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only view your own orders"
            });
        }

        const orders = await Orders.find({ userId: req.params.userId })
            .populate('userId', 'name email phone')
            .populate('address', 'details moreInfo city')
            .sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete(`/:id`, async (req, res) => {
    try {
        const deletedOrder = await Orders.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order ID not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { products } = req.body;

        // Validate products if provided
        if (products) {
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Products array is required and cannot be empty",
                });
            }
            products.forEach(product => {
                if (product.classifications) {
                    product.classifications.forEach(cls => {
                        if (!cls._id || !cls.name || !cls.image || typeof cls.price !== 'number' || typeof cls.quantity !== 'number' || typeof cls.subTotal !== 'number') {
                            throw new Error("Invalid classification data");
                        }
                    });
                }
            });
        }

        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            {
                address: req.body.address,
                note: req.body.note,
                amount: req.body.amount,
                products: req.body.products,
                orderId: req.body.orderId,
                userId: req.body.userId,
                orderType: req.body.orderType,
                orderDescription: req.body.orderDescription,
                status: req.body.status,
                paymentTransaction: req.body.paymentTransaction,
            },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order ID not found",
            });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;