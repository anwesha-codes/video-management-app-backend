import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // we have the facility to get cookies from req because we have used cookie-parser middleware inside app.js
        const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1]; //(explaination in Word)
        if (!token) {
            throw new apiError(401, "Access token is missing");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new apiError(401, "Invalid access token - user does not exist");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid or expired access token");
    }
});