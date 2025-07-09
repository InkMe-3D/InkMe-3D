const { User } = require("../models/user");
const { ImageUpload } = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const {
  sendEmailVerification,
  sendEmailResetPassword,
} = require("../config/EmailServices");
const { checkUserStatus, requireAuth, requireAdmin, requireAdminOrOwner } = require("../helper/authorization");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  console.log("userid", userid);
  return payload;
}

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
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
});

const upload = multer({
  storage: storage,
});

// Chỉ admin hoặc user đã login mới được upload avatar
router.post(`/upload`, requireAuth, checkUserStatus, upload.array("images"), async (req, res) => {
  imagesArray = [];

  try {
    for (let i = 0; i < req.files.length; i++) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };

      const img = await cloudinary.uploader.upload(
        req.files[i].path,
        options,
        function (error, result) {
          imagesArray.push(result.secure_url);
          fs.unlinkSync(`uploads/${req.files[i].filename}`);
        }
      );
    }

    let imagesUploaded = new ImageUpload({
      images: imagesArray,
    });

    imagesUploaded = await imagesUploaded.save();
    return res.status(200).json(imagesArray);
  } catch (err) {
    console.log(err);
  }
});

// ------------ img upload

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateSignupData = (data) => {
  const errors = {};
  const { name, phone, email, password, confirmPassword } = data;

  // Name validation
  if (!name || !name.trim()) {
    errors.name = "Họ và tên không được để trống";
  } else if (name.trim().length < 2) {
    errors.name = "Họ và tên phải có ít nhất 2 ký tự";
  } else if (name.trim().length > 50) {
    errors.name = "Họ và tên không được vượt quá 50 ký tự";
  }

  // Email validation
  if (!email || !email.trim()) {
    errors.email = "Email không được để trống";
  } else if (!validateEmail(email)) {
    errors.email = "Email không đúng định dạng";
  }

  // Phone validation
  if (!phone || !phone.trim()) {
    errors.phone = "Số điện thoại không được để trống";
  } else if (!validatePhone(phone)) {
    errors.phone = "Số điện thoại phải có 10-11 chữ số";
  }

  // Password validation
  if (!password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (password.length < 8) {
    errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
  } else if (!validatePassword(password)) {
    errors.password = "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt";
  }

  // Confirm password validation
  if (!confirmPassword) {
    errors.confirmPassword = "Xác nhận mật khẩu không được để trống";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Xác nhận mật khẩu không khớp";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

router.post(`/signup`, async (req, res) => {
  const { name, phone, email, password, confirmPassword, isAdmin } = req.body;

  try {
    // Validate input data
    const validation = validateSignupData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: true,
        message: "Dữ liệu không hợp lệ",
        errors: validation.errors
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "Email này đã được sử dụng"
      });
    }

    const existingUserByPhone = await User.findOne({ phone: phone });
    if (existingUserByPhone) {
      return res.status(400).json({
        error: true,
        message: "Số điện thoại này đã được sử dụng, bạn có thể đăng nhập bằng số điện thoại này"
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const result = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword,
      isAdmin: isAdmin || false,
      verificationToken,
      isVerified: false,
    });

    // Generate JWT token
    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: '30d' }
    );

    // Create verification link
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/user/signup/verify/${verificationToken}`;

    // Send email verification
    try {
      await sendEmailVerification(name, email, verificationLink);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with success response even if email fails
    }

    res.status(200).json({
      error: false,
      message: "Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác minh tài khoản.",
      user: {
        id: result._id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        isAdmin: result.isAdmin,
        isVerified: result.isVerified
      },
      token: token,
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({
          error: true,
          message: "Email này đã được sử dụng"
        });
      }
      if (error.keyPattern && error.keyPattern.phone) {
        return res.status(400).json({
          error: true,
          message: "Số điện thoại này đã được sử dụng, bạn có thể đăng nhập bằng số điện thoại này"
        });
      }
    }

    res.status(500).json({
      error: true,
      message: "Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.",
      notify: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

router.get(`/signup/verify/:token`, async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    //check user token
    if (!user) {
      return res.status(400).json({ message: "Token is not valid!" });
    }

    //verify user
    user.status = "active";
    user.isVerified = true;
    user.verificationToken = null;

    await user.save();
    return res.json({
      message: "Tài khoản đã được xác minh thành công, bạn có thể đăng nhập",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to determine if input is email or phone
const isEmail = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

const isPhone = (input) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(input);
};

router.post(`/login`, async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Validate input
    if (!emailOrPhone || !emailOrPhone.trim()) {
      return res.status(400).json({
        error: true,
        message: "Email hoặc số điện thoại không được để trống"
      });
    }

    if (!password) {
      return res.status(400).json({
        error: true,
        message: "Mật khẩu không được để trống"
      });
    }

    let existingUser;
    const cleanInput = emailOrPhone.trim();

    // Determine if input is email or phone and find user accordingly
    if (isEmail(cleanInput)) {
      existingUser = await User.findOne({ email: cleanInput.toLowerCase() });
    } else if (isPhone(cleanInput)) {
      existingUser = await User.findOne({ phone: cleanInput });
    } else {
      return res.status(400).json({
        error: true,
        message: "Vui lòng nhập email hoặc số điện thoại hợp lệ"
      });
    }

    if (!existingUser) {
      return res.status(400).json({
        error: true,
        message: "Tài khoản không tồn tại"
      });
    }

    if (existingUser.isVerified == false) {
      return res.status(400).json({
        error: true,
        message: "Tài khoản chưa được xác minh. Vui lòng kiểm tra email để xác minh tài khoản.",
      });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(400).json({
        error: true,
        message: "Mật khẩu không chính xác"
      });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      error: false,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        isAdmin: existingUser.isAdmin,
        isVerified: existingUser.isVerified
      },
      token: token,
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      error: true,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      notify: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

router.post(`/google-auth`, async (req, res) => {
  try {
    const { token } = req.body;
    const payload = await verify(token);
    const { email, name, picture } = payload;
    const user = await User.findOne({ email });
    if (!user) {
      const result = await User.create({
        name: name,
        email: email,
        password: null,
        images: [picture],
        isAdmin: false,
        status: "active",
      });

      const tokenReturn = jwt.sign(
        { email: result.email, id: result._id },
        process.env.JSON_WEB_TOKEN_SECRET_KEY
      );

      res.status(200).send({
        user: result,
        token: tokenReturn,
        msg: "Login successful",
      });
    } else {
      user.name = name;
      user.images = [picture];
      await user.save();
      const tokenReturn = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JSON_WEB_TOKEN_SECRET_KEY
      );
      res.status(200).send({
        user,
        token: tokenReturn,
        msg: "Login successful",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong",
      notify: error.message,
    });
  }
});

// router.post(`/authWithGoogle`, async (req, res) => {
//   const { name, phone, email, password, images, isAdmin } = req.body;
//   try {
//     const existingUser = await User.findOne({ email: email });

//     if (!existingUser) {
//       const result = await User.create({
//         name: name,
//         phone: phone,
//         email: email,
//         password: null,
//         images: images,
//         isAdmin: isAdmin,
//       });

//       const token = jwt.sign(
//         { email: result.email, id: result._id },
//         process.env.JSON_WEB_TOKEN_SECRET_KEY
//       );

//       res.status(200).send({
//         user: result,
//         token: token,
//         msg: "Login successful",
//       });
//     } else {
//       const existingUser = await User.findOne({ email: email });
//       const token = jwt.sign(
//         { email: existingUser.email, id: existingUser._id },
//         process.env.JSON_WEB_TOKEN_SECRET_KEY
//       );
//       res.status(200).send({
//         user: existingUser,
//         token: token,
//         msg: "Login successful",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ error: true, message: "Something went wrong" });
//     console.log(error);
//   }
// });

router.post(`/forgot-password`, async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    // Validate input
    if (!emailOrPhone || !emailOrPhone.trim()) {
      return res.status(400).json({
        error: true,
        message: "Email hoặc số điện thoại không được để trống"
      });
    }

    let user;
    const cleanInput = emailOrPhone.trim();

    // Determine if input is email or phone and find user accordingly
    if (isEmail(cleanInput)) {
      user = await User.findOne({ email: cleanInput.toLowerCase() });
    } else if (isPhone(cleanInput)) {
      user = await User.findOne({ phone: cleanInput });
    } else {
      return res.status(400).json({
        error: true,
        message: "Vui lòng nhập email hoặc số điện thoại hợp lệ"
      });
    }

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Không tìm thấy tài khoản với thông tin này"
      });
    }

    // Create token verify
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset link
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // Send email reset password (only if user has email)
    if (user.email) {
      try {
        await sendEmailResetPassword(user.email, resetLink);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        return res.status(500).json({
          error: true,
          message: "Không thể gửi email. Vui lòng thử lại sau.",
        });
      }
    } else {
      return res.status(400).json({
        error: true,
        message: "Tài khoản này không có email để gửi link reset password",
      });
    }

    res.status(200).json({
      error: false,
      message: "Link đặt lại mật khẩu đã được gửi về email của bạn",
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: true,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      notify: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Token không hợp lệ"
      });
    }

    if (!password) {
      return res.status(400).json({
        error: true,
        message: "Mật khẩu không được để trống"
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: true,
        message: "Mật khẩu phải có ít nhất 8 ký tự"
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error: true,
        message: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
      });
    }

    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Token không hợp lệ hoặc đã hết hạn"
      });
    }

    // Check if token is expired (if resetTokenExpires field exists)
    if (user.resetTokenExpires && user.resetTokenExpires < Date.now()) {
      return res.status(400).json({
        error: true,
        message: "Token đã hết hạn. Vui lòng tạo yêu cầu mới."
      });
    }

    // Create new hash password
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;

    // Delete reset token after use
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return res.status(200).json({
      error: false,
      message: "Đặt lại mật khẩu thành công!",
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      error: true,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      notify: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Chỉ admin hoặc chính user đó mới được đổi password
router.put(`/changePassword/:id`, requireAuth, checkUserStatus, async (req, res) => {
  try {
    // Kiểm tra quyền truy cập
    if (!req.user.isAdmin && req.params.id !== req.auth.id) {
      return res.status(403).json({
        error: true,
        message: "Access denied. You can only change your own password"
      });
    }

    const { password, newPass } = req.body;

    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res
        .status(400)
        .json({ error: true, message: "Current password is incorrect" });
    } else {
      let newPassword;

      if (newPass) {
        newPassword = bcrypt.hashSync(newPass, 10);
      } else {
        newPassword = existingUser.hashPassword;
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          password: newPassword,
        },
        {
          new: true,
        }
      );

      if (!user) {
        return res.status(404).send({ message: "User ID not found" });
      }

      return res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Chỉ admin mới được xem tất cả users
router.get(`/`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {
  try {
    const userList = await User.find();

    if (!userList) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).send(userList);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Admin hoặc chính user đó mới được xem thông tin
router.get(`/:id`, requireAuth, checkUserStatus, async (req, res) => {
  try {
    // Kiểm tra quyền truy cập
    if (!req.user.isAdmin && req.params.id !== req.auth.id) {
      return res.status(403).json({
        error: true,
        message: "Access denied. You can only view your own profile"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User ID not found",
      });
    }
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Chỉ admin mới được xóa user
router.delete(`/:id`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User ID not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Chỉ admin mới được xem thống kê user
router.get(`/get/count`, requireAuth, checkUserStatus, requireAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    return res.status(200).send({ userCount: userCount });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Admin hoặc chính user đó mới được cập nhật thông tin
router.put(`/:id`, requireAuth, checkUserStatus, async (req, res) => {
  try {
    // Kiểm tra quyền truy cập
    if (!req.user.isAdmin && req.params.id !== req.auth.id) {
      return res.status(403).json({
        error: true,
        message: "Access denied. You can only update your own profile"
      });
    }

    const { name, phone, email, password, address } = req.body;

    const userExist = await User.findById(req.params.id);
    if (!userExist) {
      return res.status(404).json({
        error: true,
        message: "User ID not found"
      });
    }

    let updateData = {
      name: name,
      phone: phone,
      email: email,
      images: imagesArray.length > 0 ? imagesArray : userExist.images,
    };

    // Nếu có address thì cập nhật
    if (address) {
      updateData.address = address;
    }

    // Nếu có password thì hash và cập nhật
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Routes for address management
// Admin hoặc chính user đó mới được thêm address
router.post(`/:id/address`, requireAuth, checkUserStatus, async (req, res) => {
  try {
    // Kiểm tra quyền truy cập
    if (!req.user.isAdmin && req.params.id !== req.auth.id) {
      return res.status(403).json({
        error: true,
        message: "Access denied. You can only manage your own addresses"
      });
    }

    const { city, details, moreInfo } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    user.address.push({
      city,
      details,
      moreInfo
    });

    await user.save();

    return res.status(200).json({
      message: "Address added successfully",
      user: user
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong",
      notify: error.message
    });
  }
});

// Admin hoặc chính user đó mới được cập nhật address
router.put(`/:id/address/:addressId`, requireAuth, checkUserStatus, async (req, res) => {
  try {
    // Kiểm tra quyền truy cập
    if (!req.user.isAdmin && req.params.id !== req.auth.id) {
      return res.status(403).json({
        error: true,
        message: "Access denied. You can only manage your own addresses"
      });
    }

    const { city, details, moreInfo } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const address = user.address.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ error: true, message: "Address not found" });
    }

    address.city = city;
    address.details = details;
    address.moreInfo = moreInfo;

    await user.save();

    return res.status(200).json({
      message: "Address updated successfully",
      user: user
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong",
      notify: error.message
    });
  }
});

// Admin hoặc chính user đó mới được xóa address
router.delete(`/:id/address/:addressId`, requireAuth, checkUserStatus, async (req, res) => {
  try {
    // Kiểm tra quyền truy cập
    if (!req.user.isAdmin && req.params.id !== req.auth.id) {
      return res.status(403).json({
        error: true,
        message: "Access denied. You can only manage your own addresses"
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const address = user.address.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ error: true, message: "Address not found" });
    }

    address.remove();
    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully",
      user: user
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
