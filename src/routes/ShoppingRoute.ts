import express, { Request, Response, NextFunction } from "express";
import { GetAvailableOffers, GetFoodAvailability, GetFoodsIn30Min, GetTopRestaurants, RestaurantById, SearchFoods } from "../controllers";


const router = express.Router();

// Food Availability
router.get("/:pincode", GetFoodAvailability);

// Top Restaurants
router.get("/top-restaurants/:pincode", GetTopRestaurants);

// Food Available in 30 minutes
router.get("/foods-in-30-min/:pincode", GetFoodsIn30Min);

// Search foods
router.get("/search/:pincode", SearchFoods);

// Find Offers
router.get('/offers/:pincode', GetAvailableOffers);

// Find Restaurant by ID
router.get("/restaurant/:id", RestaurantById);

export { router as ShoppingRoute };