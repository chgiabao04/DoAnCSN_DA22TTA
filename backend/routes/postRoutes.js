const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostsid, updatePost, deletePost } = require('../controllers/postController');

// Thêm bài viết
router.post('/', createPost);

// Lấy danh sách bài viết
router.get('/', getPosts);

// Lấy bài viết theo ID
router.get('/:id', getPostsid);  // Sửa đường dẫn thành :id để nhận tham số id động

// Sửa bài viết
router.put('/:id', updatePost);

// Xóa bài viết
router.delete('/:id', deletePost);

module.exports = router;
