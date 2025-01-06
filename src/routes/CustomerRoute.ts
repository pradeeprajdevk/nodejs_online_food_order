import express, { Request, Response, NextFunction } from "express";
import { CreateOrder, CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile, GetOrderById, GetOrders, RequestOTP } from "../controllers";
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

// Cart

// Order
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById);

// Payment


export { router as CustomerRoute};