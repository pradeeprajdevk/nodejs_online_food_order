import express, { Request, Response, NextFunction } from "express";
import { todo } from "node:test";
import { CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOTP } from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

// SignUp (or) Create Customer
router.post("/signup", CustomerSignup);

// Login
router.post("/login", CustomerLogin);

// authentication for below routes
router.use(Authenticate);

// Verify Customer Account
router.patch("/verify", CustomerVerify);

// OTP /Requesting OTP
router.get("/otp", RequestOTP);

// Fetch Profile
router.get("/profile", GetCustomerProfile);

// Update Profile
router.patch("/profile", EditCustomerProfile);

//TODO: After completing the above routes
// Cart
// Order
// Payment

export { router as CustomerRoute};