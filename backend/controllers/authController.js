const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const adminAccount = {
  username: 'admin',
  password: 'admin123',
  role: 'admin',
};

// Mã hóa mật khẩu cứng cho admin
adminAccount.password = bcrypt.hashSync(adminAccount.password, 10);

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kiểm tra tài khoản admin cứng
    if (username === adminAccount.username) {
      const isMatch = await bcrypt.compare(password, adminAccount.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ username, role: adminAccount.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token, role: adminAccount.role });
    }

    // Kiểm tra tài khoản từ DB
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
