import express, { Request, Response, NextFunction } from "express";
import { AddToCart, CreateOrder, CreatePayment, CustomerLogin, CustomerSignup, CustomerVerify, DeleteCart, EditCustomerProfile, GetCart, GetCustomerProfile, GetOrderById, GetOrders, RequestOTP, VerifyOffer } from "../controllers";
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
router.post("/cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);

// Order
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById);

// Apply Offers
router.get("/offer/verify/:id", VerifyOffer);

// Payment
router.post('/create-payment', CreatePayment);

export { router as CustomerRoute};