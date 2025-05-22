import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

const ONE_DAY = 24 * 60 * 60 * 1000;

export function generateTokenAndSetCookie(id, res) {
  try {
    const token = jwt.sign({ id }, ENV_VARS.JWT_SECRET);
    res.cookie("bill-easy", token, {
      maxAge: ONE_DAY,
      httpOnly: true,
      secure: ENV_VARS.NODE_ENV === "production",
      samesite: "strict",
    });

    return token;
  } catch (error) {
    console.error(error);
  }
}
