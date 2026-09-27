const User = require('../../../Model/user');
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    try {
        const { name, email, age, password, role } = req.body;

        // 1. Kiểm tra đủ thông tin bắt buộc
        if (!name || !email || !age || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ: name, email, age, password' });
        }

        // 2. Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // 3. Mã hóa mật khẩu với bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Tạo user mới
        const user = new User({
            name,
            email,
            age,
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();

        // 5. Trả về phản hồi thành công (không trả về password)
        res.status(201).json({
            message: 'Đăng ký thành công',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = registerUser;
