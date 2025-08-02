const User = require('../models/User');
const AddtoCart = require('../models/AddtoCart');
const Vendor = require('../models/Vendor');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSKEY
    },
    debug: true,
    logger: true
});

const SECRET_KEY = process.env.SECRET_KEY; 

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1d" });
};

exports.verifyEmail = async(req,res)=>{
    try{
    const { email } = req.body;
    const user = await User.findOne({where:{ email }});
    if(!user){
        return res.status(201).json({message:"Email Is Valid"});
    }
    return res.status(400).json({message:"Email Is Already Exist"})
}
    catch(error){
        console.log(error);
        return res.status(404).json({message:error})
    }
}

exports.sendOtp = async (req, res) => {
    try {
        const { name, email, mobileNo, password, role } = req.body;

        if (!name || !email || !mobileNo || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (![1, 2].includes(parseInt(role))) {
            return res.status(400).json({ message: "Invalid role. Use 1 for Admin, 2 for User." });
        }   

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        if (mobileNo.length !== 10) {
            return res.status(400).json({ message: "Mobile number must be 10 digits" });
        }
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: "User already exists" });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000);

        const encryptedPassword = await bcrypt.hash(password, 10);

        if (existingUser) {
            await existingUser.update({ name, mobileNo, password: encryptedPassword, otpCode });
        } else {
            await User.create({ name, email, mobileNo, password: encryptedPassword, otpCode });
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verification Email",
            text: `Your Verification Code Is: ${otpCode}`
        };
        
        await transporter.sendMail(mailOptions);

        setTimeout(async () => {
            const user = await User.findOne({ where: { email } });
            if (user && !user.isVerified) {
                await user.destroy();
                console.log(`Unverified user deleted: ${email}`);
            }
        }, 60000);

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error while sending OTP:", error);
        return res.status(500).json({ message: "Error while sending OTP", error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, verifyOtp } = req.body;

        if (!email || !verifyOtp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "OTP expired, please try again" });
        }

        if (parseInt(verifyOtp) !== user.otpCode) {
            return res.status(400).json({ message: "Invalid verification code. Please try again." });
        }

        await user.update({ isVerified: true, otpCode: null });

        const token = generateToken(user);
        res.cookie("authToken", token, { httpOnly: true, sameSite: "Strict" });

        return res.status(200).json({ token, message: "User registered successfully" });
    } catch (error) {
        console.error("Error while verifying OTP:", error);
        return res.status(500).json({ message: "Error while verifying OTP", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;  

        let user;
        
        if ( role === 3 ) { 
            user = await Vendor.findOne({ where: { email } });
        } 
        else if( role === 2 ){ 
            user = await User.findOne({ where: { email } }); 
        }
        else{
            return res.status(400).json({message:"Invalid Role Value"})
        }

        if (!user) {
            return res.status(400).json({ message: "Email or Role Not Registered" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = generateToken(user);
        res.cookie("authToken", token, { httpOnly: true, secure: true, sameSite: "Strict" });

        let message;
        if (role === 3) {
            message = "Vendor Login Successful";
        } else if (role === 2) {
            if (user.role == 1) {
                message = "Admin Login Successful";
            } else {
                message = "User Login Successful";
            }
        }

        // let guest_id = req.session.user_id || req.cookies.ip_address ;
        const fullIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const guest_ip = fullIp.match(/(?:\d{1,3}\.){3}\d{1,3}/)?.[0];
        let guest_id = guest_ip;
        console.log("guest_ip.......................................",guest_ip);

        if (guest_id && guest_id !== user.id) {
            const guestCartItems = await AddtoCart.findAll({ where: { addedby: guest_id } });

            if (guestCartItems.length > 0) {
                for (let guestItem of guestCartItems) {
                    
                    let existingItem = await AddtoCart.findOne({
                        where: { addedby: user.id, item_id: guestItem.item_id },
                    });

                    if (existingItem) {
                        
                        existingItem.item_qty += guestItem.item_qty;
                        existingItem.item_total = existingItem.item_price * existingItem.item_qty;
                        await existingItem.save();  
                    } else {
                        
                        await AddtoCart.update(
                            { addedby: user.id },
                            { where: { id: guestItem.id } }
                        );
                    }
                }
                await AddtoCart.destroy({ where: { addedby: guest_id } });
                console.log(`Cart items from Guest ID ${guest_id} are merged with User ID ${user.id}`);
            }
        }

        req.session.user_id = user.id;
        res.clearCookie("ip_address");

        const updatedCart = await AddtoCart.findAll({ where: { addedby: user.id } });
        return res.status(200).json({ token, role, message, id: user.id,cart:updatedCart });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
};

exports.sendResetCode = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const randomSixDigit = Math.floor(100000 + Math.random() * 900000);

        await user.update({ resetCode: randomSixDigit });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Confirmation",
            text: `Your Verification Code Is: ${randomSixDigit}`
        };

        try {
            await transporter.sendMail(mailOptions);
            setTimeout(async () => {
                await user.update({ resetCode: null });
                console.log(`Reset code expired for ${email}`);
            }, 60000);
            return res.status(200).json({ message: "Verification code sent to your email." });
        } catch (error) {
            return res.status(500).json({ message: "Failed to send email. Try again later." });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
};

exports.verifyCode = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        if (!email || !verificationCode ) {
            return res.status(400).json({ message: "Email, verification code are required." });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.resetCode !== parseInt(verificationCode)) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        await user.update({ resetCode: null });

        return res.status(200).json({ status: "success" ,message:"OTP verified"});
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
};
    
exports.savePassword = async(req,res)=>{
    try{
        const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password are required." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: encryptedPassword});
    return res.status(200).json({ status:"success" , message: "Password reset successfully." });
    }
    catch(error){
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.logout = async (req, res) => {
    res.clearCookie("authToken", { httpOnly: true, secure: true, sameSite: "Strict" });
    return res.json({ message: "Logout successful" });
};

exports.getAllUser = async(req,res)=>{
    try{
        const users = await User.findAll({ attributes: ['name','email','mobileNo']});
        return res.status(201).json({status:"success",message:"User Fetched Successfully",users:users})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user = await User.findOne({ where: { id: user_id }, attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        return res.status(200).json({ status: "success", message: "User Fetched Successfully", user: user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

exports.editUserProfile = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { name, mobileNo } = req.body;
        console.log("Request Body:", req.body);
        console.log("User ID:", req.user.id);

        const user = await User.findByPk(user_id);
        console.log("User Found:", user);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({ name, mobileNo });

        return res.status(200).json({ message: "Profile updated successfully", user:user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



