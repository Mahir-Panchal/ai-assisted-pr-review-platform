import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// ─── Protect ─────────────────────────────────────────────────────────────────
// Verifies access token and attaches user to req.user
// Preserved behaviour — only internals upgraded

export const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Not authorized, no token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Not authorized, no token provided");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new ApiError(401, "Not authorized, token is invalid or expired");
    }

    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "User belonging to this token no longer exists");
    }

    if (user.isBlocked) {
        throw new ApiError(403, "Your account has been suspended");
    }

    req.user = user;
    next();
});

// ─── Role Guard ───────────────────────────────────────────────────────────────
// Usage: requireRole("owner") or requireRole("owner", "contributor")
// Always placed AFTER protect in the middleware chain

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `Access denied. Required role: ${roles.join(" or ")}`
            );
        }
        next();
    };
};
