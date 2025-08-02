const jwt = require('jsonwebtoken');
const Vendor = require("../models/Vendor");
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    try {
        let token = req.cookies.authToken || req.headers.authorization || req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No Token Provided" });
        }

        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(403).json({ message: "Invalid or Expired Token" });
            }
            console.log("Decoded JWT:", decoded);
            req.user = decoded; 
            next();
        });

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ message: "Server error during authentication" });
    }
};

exports.verifyAdmin = (req, res, next) => {
    console.log("req.role:-",req.user.role);
    if (!req.user || Number(req.user.role) !== 1) {
        return res.status(403).json({ message: "Access denied. Only admins can perform this action." });
    }
    next();
};


exports.optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    }
    next(); 
};

exports.verifyUserOrIP = async (req, res, next) => {
    try {
        const fullIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const requestIp = fullIp.match(/(?:\d{1,3}\.){3}\d{1,3}/)?.[0];

        console.log("Requester's IP:", requestIp);

        let user_id = null;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];

            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                req.user = decoded;
                user_id = decoded.id; 
                console.log("Authenticated User ID:", user_id);
            } catch (err) {
                console.error("JWT Verification Error:", err.message);
                return res.status(401).json({ message: "Invalid or expired token" });
            }
        }

        if (!user_id) {
            console.log("No valid token, checking IP address");

            user_id = requestIp;
        }
        req.session.user_id = user_id;
        
        req.verifiedUserId = user_id;
        console.log("Final Verified User ID:", req.verifiedUserId);
        next();
    } catch (error) {
        console.error("Middleware Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.checkVendorStatus = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }
        const user_id = req.user.id;

        const vendor = await Vendor.findByPk(user_id);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.status !== "approved") {
            return res.status(403).json({ message: "Access denied: Vendor not approved by admin yet." });
        }

        req.vendor = vendor;
        next(); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
