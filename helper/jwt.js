const { expressjwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.JSON_WEB_TOKEN_SECRET_KEY;
    return expressjwt({
        secret: secret,
        algorithms: ["HS256"]
    }).unless(function (req) {
        // Auth routes - không cần JWT
        if (req.path === '/api/user/signin' ||
            req.path === '/api/user/signup' ||
            req.path === '/api/user/forgotpassword' ||
            req.path === '/api/user/resetpassword' ||
            req.path === '/api/cart/add' ||
            req.path === '/api/products/upload-file') {
            return true;
        }

        // Signup verify routes
        if (req.path.includes('/api/user/signup/verify/')) {
            return true;
        }

        // Public GET routes - không cần JWT
        if (req.method === 'GET' && (
            req.path.startsWith('/api/products') ||
            req.path.startsWith('/api/category') ||
            req.path.startsWith('/api/subCat') ||
            req.path.startsWith('/api/homeBanner') ||
            req.path.startsWith('/api/search') ||
            req.path.startsWith('/uploads')
        )) {
            return true;
        }

        // AI routes - không cần JWT
        if (req.path === '/api/ai/moderate-content' ||
            req.path === '/api/ai/chat') {
            return true;
        }

        // Tất cả routes khác cần JWT
        return false;
    });
}

module.exports = authJwt;
