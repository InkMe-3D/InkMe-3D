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
            .populate('userId', 'name email phone')
            .populate('address', 'details moreInfo city provinceName districtName wardName')
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

        // Debug: Kiểm tra products data nhận được
        console.log('🔍 Products nhận được từ client:', JSON.stringify(products, null, 2));

        // Debug: Kiểm tra riêng inkmeFile trong products
        products.forEach((product, index) => {
            if (product.inkmeFile) {
                console.log(`✨ Product ${index} có inkmeFile:`, {
                    productTitle: product.productTitle,
                    inkmeFile: product.inkmeFile
                });
            }
        });

        // Tạo order mới
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

        // Debug: Kiểm tra order đã lưu
        console.log('💾 Order đã lưu vào database:', JSON.stringify(savedOrder, null, 2));

        // Debug: Kiểm tra riêng inkmeFile trong saved order
        savedOrder.products.forEach((product, index) => {
            if (product.inkmeFile) {
                console.log(`✅ Saved Product ${index} có inkmeFile:`, {
                    productTitle: product.productTitle,
                    inkmeFile: product.inkmeFile
                });
            }
        });

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
        const order = await Orders.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('address', 'details moreInfo city provinceName districtName wardName');
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

// Get orders with visibility filter (MUST BE BEFORE /:id routes)
router.get(`/admin/list`, async (req, res) => {
    try {
        const {
            showHidden = false,
            page = 1,
            perPage = 10,
            sortBy = 'dateCreated',
            sortOrder = 'desc',
            status,
            search,
            startDate,
            endDate
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(perPage);

        // Build filter
        const filter = {};
        if (!showHidden) {
            filter.isHidden = { $ne: true };
        }

        // Status filter
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Date range filter
        if (startDate || endDate) {
            filter.dateCreated = {};
            if (startDate) {
                filter.dateCreated.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.dateCreated.$lte = new Date(endDate + 'T23:59:59.999Z');
            }
        }

        // Search filter
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { orderId: searchRegex },
                { 'userId.name': searchRegex },
                { 'userId.email': searchRegex },
                { 'userId.phone': searchRegex }
            ];
        }

        // Build sort object
        let sortObject = {};
        if (sortBy === 'dateCreated') {
            sortObject.dateCreated = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'orderId') {
            sortObject.orderId = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'amount') {
            sortObject.amount = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'status') {
            sortObject.status = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortObject.dateCreated = -1; // default sort
        }

        const totalOrders = await Orders.countDocuments(filter);
        const totalPages = Math.max(1, Math.ceil(totalOrders / parseInt(perPage)));

        const ordersList = await Orders.find(filter)
            .populate('userId', 'name email phone')
            .populate('address', 'details moreInfo city provinceName districtName wardName')
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(perPage))
            .exec();

        return res.status(200).json({
            ordersList: ordersList,
            totalPages: totalPages,
            page: parseInt(page),
            totalOrders: totalOrders,
            showHidden: showHidden === 'true',
            filters: {
                status,
                search,
                startDate,
                endDate,
                sortBy,
                sortOrder
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Toggle order visibility (hide/show) - MUST BE BEFORE /:id routes
router.put("/:id/toggle-visibility", async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order ID not found",
            });
        }

        // Toggle isHidden status
        order.isHidden = !order.isHidden;
        const updatedOrder = await order.save();

        return res.status(200).json({
            success: true,
            message: `Order ${updatedOrder.isHidden ? 'hidden' : 'shown'} successfully`,
            order: updatedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// User payment route
router.put("/:id/pay", requireAuth, checkUserStatus, async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order ID not found",
            });
        }

        // Check if user owns this order
        if (order.userId.toString() !== req.auth.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only pay for your own orders"
            });
        }

        // Check if order can be paid
        if (order.status !== 'Unpaid') {
            return res.status(400).json({
                success: false,
                message: "Order cannot be paid. Current status: " + order.status
            });
        }

        // Update order status to Paid
        order.status = 'Paid';
        order.paymentTransaction = req.body.paymentTransaction || null;
        const updatedOrder = await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment successful",
            order: updatedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// User cancel order route
router.put("/:id/cancel", requireAuth, checkUserStatus, async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order ID not found",
            });
        }

        // Check if user owns this order
        if (order.userId.toString() !== req.auth.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only cancel your own orders"
            });
        }

        // Check if order can be cancelled
        if (order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }

        if (order.status === 'shipped' || order.status === 'Delivered') {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel order that has been shipped or delivered"
            });
        }

        // Check time limit (24 hours after payment)
        const now = new Date();
        const orderDate = new Date(order.dateCreated);
        const timeDiff = now - orderDate;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (order.status === 'Paid' && hoursDiff > 24) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel order after 24 hours of payment"
            });
        }

        // Update order status to cancelled
        order.status = 'cancelled';
        const updatedOrder = await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order: updatedOrder
        });
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
                // Validate inkmeFile if present
                if (product.inkmeFile) {
                    if (product.inkmeFile.url && typeof product.inkmeFile.url !== 'string') {
                        throw new Error("Invalid inkmeFile URL");
                    }
                    if (product.inkmeFile.sceneName && typeof product.inkmeFile.sceneName !== 'string') {
                        throw new Error("Invalid inkmeFile sceneName");
                    }
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
                isHidden: req.body.isHidden,
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

// Toggle order visibility (hide/show)
router.patch("/:id/toggle-visibility", async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order ID not found",
            });
        }

        // Toggle isHidden status
        order.isHidden = !order.isHidden;
        const updatedOrder = await order.save();

        return res.status(200).json({
            success: true,
            message: `Order ${updatedOrder.isHidden ? 'hidden' : 'shown'} successfully`,
            order: updatedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;