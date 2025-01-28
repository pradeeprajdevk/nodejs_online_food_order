import express, { Request, Response, NextFunction } from "express";
import { DeliveryUserLogin, DeliveryUserSignup, EditDeliveryUserProfile, GetDeliveryUserProfile, UpdateDeliveryUserStatus } from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

// SignUp (or) Create Customer
router.post("/signup", DeliveryUserSignup);

// Login
router.post("/login", DeliveryUserLogin);

// authentication for below routes
router.use(Authenticate);

// Change service status
router.put('/change-status', UpdateDeliveryUserStatus);

// Fetch Profile
router.get("/profile", GetDeliveryUserProfile);

// Update Profile
router.patch("/profile", EditDeliveryUserProfile);

export { router as DeliveryRoute};