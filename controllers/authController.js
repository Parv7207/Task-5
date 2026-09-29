const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const registerUser = async(req, res) =>{
    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"Email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });
        res.status(201).json({
            message:"User registered successfully",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch(error){
        res.status(500).json({
            message:"Server error"
        });
    }
};
const loginUser = async(req, res) =>{
    try{
        const{email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const otp = Math.floor(
            100000 + Math.random()*900000
        ).toString();
        user.otp = otp;
        user.otpExpires = Date.now()+5*60*1000;
        await user.save();
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to:email,
            subject:"Your Login OTP",
            text:`Your OTP is ${otp}. It is valid for 5 minutes.`
        });
        res.status(200).json({
            message:"OTP sent successfully"
        });
    } catch(error){
        console.log(error);
        res.status(500).json({
            message:"Server error"
        });
    }
};

const verifyOTP = async(req, res) =>{
    try{
        const {email,otp} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"User not found"
            });
        }
        if(
            user.otp !== otp ||
            !user.otpExpires ||
            user.otpExpires < Date.now()
        ) {
            return res.status(401).json({
                message:"Invalid or expired OTP"
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.status(200).json({
            message:"Login successful",
            token: token
        });
    } catch(error){
        console.log(error);
        res.status(500).json({
            message:"Server error"
        });
    }
};
module.exports={
    registerUser,
    loginUser,
    verifyOTP
};