const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Send token in response and save it as a cookie
const sendToken = (user, statusCode, res) => {
    const token = generateToken(user._id);

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

// Generate JWT token
const generateToken = (id) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        return token;
    } catch (error) {
        // Handle any errors that might occur during token generation
        console.error('Error generating JWT token:', error.message);
        throw new Error('Token generation failed');
    }
};

// Hash a token
const hashToken = (token) => {
    return crypto.createHash("sha256").update(token.toString()).digest("hex");
};

module.exports = {
    sendToken,
    generateToken,
    hashToken
};
