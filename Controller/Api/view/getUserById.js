const User = require('../../../Model/user');

const getUserById = async (req, res) => {
    //phân quyền
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        return res.status(403).json({
            message: 'Không có quyền'
        });
    }
    try {

        const user = await User.findById(req.params.id).select('-password');    
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy user'
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = getUserById;