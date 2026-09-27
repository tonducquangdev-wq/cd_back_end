const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CD-Back-End API Documentation',
            version: '1.0.0',
            description: 'Tài liệu API hệ thống Quản lý người dùng (Node.js, Express, MongoDB, JWT)'
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Nhập JWT Token vào đây (ví dụ: Bearer <your_token>)'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '65123abc456def7890123456' },
                        name: { type: 'string', example: 'Nguyễn Văn A' },
                        email: { type: 'string', example: 'nguyenvana@gmail.com' },
                        age: { type: 'integer', example: 25 },
                        role: { type: 'string', example: 'user' },
                        createdAt: { type: 'string', example: '2026-09-27T10:00:00.000Z' }
                    }
                },
                RegisterInput: {
                    type: 'object',
                    required: ['name', 'email', 'age', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Nguyễn Văn A' },
                        email: { type: 'string', example: 'nguyenvana@gmail.com' },
                        age: { type: 'integer', example: 25 },
                        password: { type: 'string', example: 'password123' },
                        role: { type: 'string', example: 'user' }
                    }
                },
                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'nguyenvana@gmail.com' },
                        password: { type: 'string', example: 'password123' }
                    }
                },
                UserInput: {
                    type: 'object',
                    required: ['name', 'email', 'age', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Trần Văn B' },
                        email: { type: 'string', example: 'tranvanb@gmail.com' },
                        age: { type: 'integer', example: 30 },
                        password: { type: 'string', example: 'password123' },
                        role: { type: 'string', example: 'user' }
                    }
                },
                UpdateUserInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Trần Văn B Cập Nhật' },
                        email: { type: 'string', example: 'tranvanb@gmail.com' },
                        age: { type: 'integer', example: 31 },
                        password: { type: 'string', example: 'newpassword123' },
                        role: { type: 'string', example: 'admin' }
                    }
                }
            }
        }
    },
    apis: ['./Router/*.js', './config/swagger.js']
};

const swaggerSpecs = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpecs
};
