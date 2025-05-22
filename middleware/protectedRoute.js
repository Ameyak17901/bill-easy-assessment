import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies["bill-easy"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized - No token found" });
    }
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token",
      });
    }

    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" + error.message });
  }
};
