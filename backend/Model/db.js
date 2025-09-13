const mongoose = require("mongoose");
require('dotenv').config({ path: './config/config.env' });

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("MongoDB connected ✅");
    });

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (error) { 
        console.error("MongoDB connection failed ❌", error);
    }
};

connectDB();

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Date, default: null },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Date, default: null }
}, { timestamps: true });
const userModel = mongoose.models.IDEAVAULT || mongoose.model('IDEAVAULT', userSchema);

module.exports = {
    userModel
};
