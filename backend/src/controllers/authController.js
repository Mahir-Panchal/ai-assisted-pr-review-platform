import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );
};

export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(409, "An account with this email already exists");
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json(
        new ApiResponse(201, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken,
        }, "Account created successfully")
    );
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (user.isBlocked) {
        throw new ApiError(403, "Your account has been suspended. Contact support.");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken,
        }, "Login successful")
    );
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Refresh token mismatch or already used");
    }

    if (user.isBlocked) {
        throw new ApiError(403, "Account suspended");
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json(
        new ApiResponse(200, { accessToken: newAccessToken }, "Token refreshed")
    );
});

export const logoutUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.refreshToken = null;
        await user.save();
    }

    res.status(200).json(
        new ApiResponse(200, null, "Logged out successfully")
    );
});

export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
});