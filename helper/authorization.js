const { User } = require("../models/user");

// Middleware kiểm tra user có tồn tại và active không
const checkUserStatus = async (req, res, next) => {
    try {
        const userId = req.auth.id; // req.auth được set bởi JWT middleware

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                error: true,
                message: "User not found"
            });
        }

        if (user.status !== "active") {
            return res.status(401).json({
                error: true,
                message: "Account is not active"
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                error: true,
                message: "Account is not verified"
            });
        }

        // Gắn thông tin user vào request để sử dụng ở middleware tiếp theo
        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Error checking user status",
            details: error.message
        });
    }
};

// Middleware kiểm tra quyền admin
const requireAdmin = async (req, res, next) => {
    try {
        // Kiểm tra user đã được set bởi checkUserStatus middleware
        if (!req.user) {
            return res.status(401).json({
                error: true,
                message: "User information not found"
            });
        }

        if (!req.user.isAdmin) {
            return res.status(403).json({
                error: true,
                message: "Admin access required"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Error checking admin status",
            details: error.message
        });
    }
};

// Middleware kiểm tra ownership (user chỉ có thể truy cập data của chính mình)
const requireOwnership = (resourceField = 'userId') => {
    return async (req, res, next) => {
        try {
            const userId = req.auth.id;
            const resourceUserId = req.params[resourceField] || req.body[resourceField];

            // Admin có thể truy cập tất cả
            if (req.user && req.user.isAdmin) {
                return next();
            }

            // User chỉ có thể truy cập data của chính mình
            if (userId !== resourceUserId) {
                return res.status(403).json({
                    error: true,
                    message: "Access denied. You can only access your own data"
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "Error checking ownership",
                details: error.message
            });
        }
    };
};

// Middleware cho phép cả admin và owner truy cập
const requireAdminOrOwner = (resourceField = 'userId') => {
    return async (req, res, next) => {
        try {
            const userId = req.auth.id;
            const resourceUserId = req.params[resourceField] || req.body[resourceField];

            // Admin có thể truy cập tất cả
            if (req.user && req.user.isAdmin) {
                return next();
            }

            // Owner có thể truy cập data của mình
            if (userId === resourceUserId) {
                return next();
            }

            return res.status(403).json({
                error: true,
                message: "Access denied. Admin or owner access required"
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "Error checking admin or owner status",
                details: error.message
            });
        }
    };
};

// Middleware kiểm tra user đã login (chỉ cần JWT hợp lệ)
const requireAuth = (req, res, next) => {
    if (!req.auth || !req.auth.id) {
        return res.status(401).json({
            error: true,
            message: "Authentication required"
        });
    }
    next();
};

module.exports = {
    checkUserStatus,
    requireAdmin,
    requireOwnership,
    requireAdminOrOwner,
    requireAuth
}; 