import express, { Request, Response, NextFunction } from "express";
import { AddOffer, AddToCart, CreateOrder, CustomerLogin, CustomerSignup, CustomerVerify, DeleteCart, EditCustomerProfile, EditOffer, GetCart, GetCustomerProfile, GetOffers, GetOrderById, GetOrders, RequestOTP } from "../controllers";
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

// Offers
router.get("/offers", GetOffers);
router.post("/offer", AddOffer);
router.put("/offer/:id", EditOffer);

// Delete Offers

// Payment


export { router as CustomerRoute};