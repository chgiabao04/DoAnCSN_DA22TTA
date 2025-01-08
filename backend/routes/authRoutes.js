const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

// Đoạn này chỉ xử lý login mà không cần middleware xác thực
router.post('/login', login);

module.exports = router;
