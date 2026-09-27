const User = require('../../../Model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Email không tồn tại'
            });
        }
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!isMatch) {
            return res.status(400).json({
                message: 'Sai mật khẩu'
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'secretkey123',
            {
                expiresIn: '1d'
            }
        );
        res.json({
            message: 'Đăng nhập thành công',
            token
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = loginUser;