const Post = require('../models/Post');

// Tạo bài viết
const createPost = async (req, res) => {
  try {
    const existingPost = await Post.findOne({ title: req.body.title });
    if (existingPost) {
      return res.status(400).json({ message: 'Bài viết đã tồn tại!' });
    }

    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Lỗi khi tạo bài viết:', error);
    res.status(500).send(error);
  }
};

// Lấy tất cả bài viết
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // Lấy tất cả bài viết
    res.status(200).json(posts);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error);
    res.status(500).send(error);
  }
};

// Lấy bài viết theo ID
const getPostsid = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Lấy bài viết theo ID
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Lỗi khi lấy bài viết:', error);
    res.status(500).send(error);
  }
};

// Sửa bài viết
const updatePost = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi sửa bài viết', error: error.message });
  }
};

// Xóa bài viết
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }

    res.status(200).json({ message: 'Xóa bài viết thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa bài viết', error: error.message });
  }
};

module.exports = { createPost, getPosts, getPostsid, updatePost, deletePost };
