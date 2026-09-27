const mongoose=require('mongoose');
// dinh nghia schema user
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 0, max: 120, required: true },
    password: { type: String, required: true, },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });//tu dong tao moi truong

const User = mongoose.model('User', UserSchema);
module.exports = User;