import { Router } from "express";
import {
  registerUser,
  initializeUser,
  getUserData,
  loginUser,
  logoutUser,
  refreshAccessToken,
  sendOtp,
  verifyOtp,
  googleCallback,
  handleUserOAuth,
  updateUser,
} from "../controllers/user.controller";
import { verifyUserJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/initialize").post(initializeUser);
router.route("/me").get(verifyUserJWT, getUserData);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyUserJWT, logoutUser);
router.route("/update").put(verifyUserJWT, updateUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/otp/send").post(sendOtp);
router.route("/otp/verify").post(verifyOtp);
router.route("/google/callback").get(googleCallback);
router.route("/oauth").post(handleUserOAuth);

export default router;
