const User = require('../../../Model/user');
const bcrypt = require('bcryptjs');

const updateUser = async (req, res) => {
    //phân quyền
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        return res.status(403).json({
            message: 'Không có quyền cập nhật'
        });
    }
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { returnDocument: 'after', runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng để cập nhật' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = updateUser;
