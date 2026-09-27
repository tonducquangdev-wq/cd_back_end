const express = require('express');
const router = express.Router();

// Import các controller từ Controller/Api
const getAllUsers = require('../Controller/Api/view/getAllUsers');
const getUserById = require('../Controller/Api/view/getUserById');
const createUser = require('../Controller/Api/create/createUser');
const updateUser = require('../Controller/Api/update/updateUser');
const deleteUser = require('../Controller/Api/delete/deleteUser');
const registerUser = require('../Controller/Api/register/registerUser');
const loginUser = require('../Controller/Api/login/loginUser');
const auth = require('../Middleware/auth');
const getProfile = require('../Controller/Api/profile/getProfile');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Đăng ký tài khoản mới (Công khai)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc Email đã tồn tại
 */
router.post('/register', [
    body('name').notEmpty().withMessage('Tên không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Tuổi phải từ 1 - 120'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')
], registerUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Đăng nhập hệ thống (Công khai)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT Token
 *       400:
 *         description: Sai email hoặc mật khẩu
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Lấy thông tin tài khoản đang đăng nhập
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin cá nhân
 *       401:
 *         description: Không có token hoặc Token không hợp lệ
 */
router.get('/profile', auth, getProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách người dùng (Hỗ trợ Tìm kiếm & Phân trang)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên hoặc email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi trên 1 trang
 *     responses:
 *       200:
 *         description: Trả về danh sách người dùng kèm metadata phân trang
 *       401:
 *         description: Chưa xác thực
 */
router.get('/users', auth, getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về chi tiết người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get('/users/:id', auth, getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Tạo người dùng mới từ Admin Panel
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công (không trả về password)
 *       400:
 *         description: Lỗi validation dữ liệu
 */
router.post('/users', auth, [
    body('name').notEmpty().withMessage('Tên không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('age').isInt({ min: 0, max: 120 }).withMessage('Tuổi phải là số nguyên từ 0 đến 120'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')
], createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng theo ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền cập nhật
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put('/users/:id', auth, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa người dùng theo ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần xóa
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *       403:
 *         description: Không có quyền xóa
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.delete('/users/:id', auth, deleteUser);

module.exports = router;
