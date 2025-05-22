import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    // check email is valid
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Email address." });
    }

    // check password is valid
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, error: "Password must be 6 characters long." });
    }

    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
      });
    }
    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log(newUser);
    generateTokenAndSetCookie(newUser._id, res);

    return res
      .status(201)
      .json({ success: true, message: "Signed Up successfully" });
  } catch (error) {
    console.error("Error signing up: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

export async function signin(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "All the fields are required." });
    }

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        error: "User not found, Please sign up instead.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credentials." });
    }

    const cookie = generateTokenAndSetCookie(existingUser._id, res);
    console.log(cookie);

    return res
      .status(200)
      .json({
        success: true,
        message: "User signed in successfully.",
        token: cookie,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error" + error.message,
    });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("bill-easy");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" + error.message });
  }
}

export default function checkAuth(req, res) {
  try {
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error("Error in check Auth", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" + error.message });
  }
}
