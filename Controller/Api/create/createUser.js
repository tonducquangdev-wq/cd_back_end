const User = require('../../../Model/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const userData = { ...req.body };
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        const newUser = await User.create(userData);
        const userObj = newUser.toObject();
        delete userObj.password;

        return res.status(201).json(userObj);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = createUser;
