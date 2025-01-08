require('dotenv').config(); // Tải các biến từ file .env
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes'); // Import routes
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const { verifyToken, isAdmin } = require('./middleware/authMiddleware'); // Middleware xác thực
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URL = 'mongodb+srv://chaugiabao:0919329124@cluster0.zly7s.mongodb.net/mydatabase';

// Middleware
app.use(cors());  // Cho phép tất cả các domain kết nối đến server (cấu hình CORS)
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Kết nối MongoDB thành công!'))
  .catch((err) => console.error('Không thể kết nối MongoDB:', err));

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Tên file = timestamp + đuôi file
  }
});

// Cấu hình upload
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: function (req, file, cb) {
    // Kiểm tra loại file
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Chỉ cho phép upload ảnh!'))
    }
  }
});

// Serve static files từ thư mục uploads
app.use('/uploads', express.static('uploads'));

// Route upload ảnh
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }
    
    // Trả về đường dẫn của file
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
      url: imageUrl,
      message: 'Upload thành công'
    });
  } catch (error) {
    console.error('Lỗi upload:', error);
    res.status(500).json({
      message: 'Lỗi khi upload ảnh',
      error: error.message
    });
  }
});

// Sử dụng routes
app.use('/api/posts', postRoutes); // Không cần middleware verifyToken cho route này
app.use('/api/auth', authRoutes); // Route đăng nhập

// Route cơ bản
app.get('/', (req, res) => {
  res.send('Backend kết nối MongoDB thành công!');
});

// Route chỉ dành cho admin
app.get('/api/admin', verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Chào mừng Admin!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
