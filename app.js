const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helper/jwt");
const path = require("path");

const corsOptions = {
    origin: [
      "https://inkme3d.com",
      "https://www.inkme3d.com",
      "http://localhost:5173"
    ],
    credentials: true, // để an toàn cho login/cookie (nếu không dùng cookie vẫn OK)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  };
  
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
  

//middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(authJwt());

//Routes
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/categories");
const subCatRoutes = require("./routes/subCat");
const productRoutes = require("./routes/products");
const imageUploadRoutes = require("./helper/imageUpload");
const productSizeRoutes = require("./routes/productSize");
const productRamsRoutes = require("./routes/productRams");
const productReviewsRoutes = require("./routes/productReviews");
const cart = require("./routes/cart");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/orders");
const homeBannerRouters = require("./routes/homeBanner");
const searchRoutes = require("./routes/search");
const aiRoutes = require("./routes/ai");
const addressRoutes = require("./routes/address");

app.use(`/api/user`, userRoutes);
app.use(`/uploads`, express.static("uploads"));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/subCat`, subCatRoutes);
app.use(`/api/products`, productRoutes);
app.use(`/api/imageUpload`, imageUploadRoutes);
app.use(`/api/productSize`, productSizeRoutes);
app.use(`/api/productRams`, productRamsRoutes);
app.use(`/api/productReviews`, productReviewsRoutes);
app.use(`/api/cart`, cart);
app.use("/api/payment", paymentRoutes);
app.use(`/api/orders`, orderRoutes);
app.use(`/api/homeBanner`, homeBannerRouters);
app.use(`/api/search`, searchRoutes);
app.use(`/api/ai`, aiRoutes);
app.use(`/api/address`, addressRoutes);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database");
    //Server
    app.listen(process.env.PORT, '0.0.0.0', () => {
        console.log(`Server is running http://localhost:${process.env.PORT}`);
    })
}).catch((err) => {
    console.log(err);
})

// Global error handlers to prevent server crashes
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log the error
});

// Express error handler middleware
app.use((err, req, res, next) => {
    console.error('❌ Express Error:', err);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

