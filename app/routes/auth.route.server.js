import { Router } from "express";

const router = Router();

import {
  DisplayLoginPage,
  DisplayRegisterPage,
  ProcessLoginPage,
  ProcessLogout,
  ProcessRegisterPage,
} from "../controllers/auth.controller.server.js";

// Display
router.get("/login", DisplayLoginPage);
router.get("/register", DisplayRegisterPage);

//Process
router.post("/login", ProcessLoginPage);
router.post("/register", ProcessRegisterPage);

//Logout
router.get("/logout", ProcessLogout);

export default router;
