const express = require("express");
const router = express.Router();
const { Address } = require("../models/address");
const { User } = require("../models/user");
const { checkUserStatus, requireAuth, requireAdmin } = require("../helper/authorization");

// Get all addresses of a user - Admin hoặc chính user đó mới được xem
router.get(`/user/:userId`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        // Kiểm tra quyền truy cập
        if (!req.user.isAdmin && req.params.userId !== req.auth.id) {
            return res.status(403).json({
                error: true,
                message: "Access denied. You can only view your own addresses"
            });
        }

        const addresses = await Address.find({ userId: req.params.userId });
        return res.status(200).send(addresses);
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

// Add new address - User đã login có thể thêm địa chỉ cho mình
router.post(`/`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        const { userId, city, details, moreInfo } = req.body;

        // Kiểm tra quyền truy cập - User chỉ có thể thêm địa chỉ cho chính mình
        if (!req.user.isAdmin && userId !== req.auth.id) {
            return res.status(403).json({
                error: true,
                message: "Access denied. You can only add addresses for yourself"
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        // If this is the first address, make it default
        const addressCount = await Address.countDocuments({ userId });
        const isDefault = addressCount === 0;

        const address = new Address({
            userId,
            city,
            details,
            moreInfo,
            isDefault
        });

        const savedAddress = await address.save();
        return res.status(201).json({
            message: "Address added successfully",
            address: savedAddress
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

// Update address - User chỉ có thể cập nhật địa chỉ của mình
router.put(`/:id`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        const { city, details, moreInfo } = req.body;

        // Kiểm tra địa chỉ có tồn tại không
        const existingAddress = await Address.findById(req.params.id);
        if (!existingAddress) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }

        // Kiểm tra quyền truy cập - User chỉ có thể cập nhật địa chỉ của mình
        if (!req.user.isAdmin && existingAddress.userId.toString() !== req.auth.id) {
            return res.status(403).json({
                error: true,
                message: "Access denied. You can only update your own addresses"
            });
        }

        const address = await Address.findByIdAndUpdate(
            req.params.id,
            {
                city,
                details,
                moreInfo
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Address updated successfully",
            address: address
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

// Delete address - User chỉ có thể xóa địa chỉ của mình
router.delete(`/:id`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }

        // Kiểm tra quyền truy cập - User chỉ có thể xóa địa chỉ của mình
        if (!req.user.isAdmin && address.userId.toString() !== req.auth.id) {
            return res.status(403).json({
                error: true,
                message: "Access denied. You can only delete your own addresses"
            });
        }

        // If this was the default address and there are other addresses,
        // make another address the default
        if (address.isDefault) {
            const anotherAddress = await Address.findOne({
                userId: address.userId,
                _id: { $ne: address._id }
            });
            if (anotherAddress) {
                anotherAddress.isDefault = true;
                await anotherAddress.save();
            }
        }

        await Address.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Address deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

// Set address as default - User chỉ có thể set default cho địa chỉ của mình
router.put(`/:id/set-default`, requireAuth, checkUserStatus, async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ error: true, message: "Address not found" });
        }

        // Kiểm tra quyền truy cập - User chỉ có thể set default cho địa chỉ của mình
        if (!req.user.isAdmin && address.userId.toString() !== req.auth.id) {
            return res.status(403).json({
                error: true,
                message: "Access denied. You can only set default for your own addresses"
            });
        }

        // Remove default from all other addresses of this user
        await Address.updateMany(
            { userId: address.userId },
            { isDefault: false }
        );

        // Set this address as default
        address.isDefault = true;
        await address.save();

        return res.status(200).json({
            message: "Address set as default successfully",
            address: address
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
            notify: error.message
        });
    }
});

module.exports = router; 