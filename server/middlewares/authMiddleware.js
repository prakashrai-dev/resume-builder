// server/middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    // 1. Check for the header and the 'Bearer' prefix in one go
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // 2. Extract the token from the "Bearer <token>" string
        const token = req.headers.authorization.split(' ')[1];

        // 3. IMPORTANT: Check if the token is empty, null, or undefined after splitting
        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ message: 'Not authorized, token is malformed' });
        }

        // 4. Verify the extracted token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user ID to the request object
        req.userId = decoded.userId;
        
        next(); // Proceed to the next function

    } catch (error) {
        // This will now only catch actual verification errors (e.g., expired, invalid signature)
        console.error(error); // Log the actual error for debugging
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export default protect;