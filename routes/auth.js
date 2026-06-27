import express from "express";
import { adminAuthController, authController } from "../controller/authController.js";

const router = express.Router();

router.post("/", authController);

router.post("/admin-login", adminAuthController);

export default router;