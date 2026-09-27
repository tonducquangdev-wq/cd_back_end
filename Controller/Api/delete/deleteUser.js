const User = require('../../../Model/user');

const deleteUser = async (req, res) => {
    //phân quyền
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        return res.status(403).json({
            message: 'Không có quyền xóa'
        });
    }
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng để xóa' });
        }
        res.json({ message: 'Xóa người dùng thành công!', user: deletedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = deleteUser;
