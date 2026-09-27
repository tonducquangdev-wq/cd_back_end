require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./Router/userRouter');
const { swaggerUi, swaggerSpecs } = require('./config/swagger');

const app = express();

// Middleware CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware đọc dữ liệu JSON và phục vụ static files
app.use(express.json());
app.use(express.static('public'));

// Tích hợp Swagger Documentation tại route /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/qlnv')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Router API
app.use('/api', userRouter);

// Route mặc định chuyển hướng sang trang đăng nhập
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});