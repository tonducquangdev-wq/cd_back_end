const User = require('../../../Model/user');

const getAllUsers = async (req, res) => {
    try {
        const { search, page, limit } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        if (page || limit) {
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const skip = (pageNum - 1) * limitNum;

            const totalUsers = await User.countDocuments(query);
            const totalPages = Math.ceil(totalUsers / limitNum);

            const users = await User.find(query)
                .select('-password')
                .skip(skip)
                .limit(limitNum);

            return res.json({
                totalUsers,
                totalPages,
                currentPage: pageNum,
                data: users
            });
        }

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = getAllUsers;
