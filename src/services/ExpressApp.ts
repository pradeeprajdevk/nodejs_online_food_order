import express, { Application } from "express";
import { AdminRoute, CustomerRoute, DeliveryRoute, ShoppingRoute, VendorRoute } from "../routes/index";
import path from "path";

export default async (app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}));
    app.use("/images", express.static(path.join(__dirname, '../images')));

    // Routes
    app.get("/", (req, res) => {
        res.json({ message: "Hello from food order Backend!" });
    });
    app.use("/admin", AdminRoute);
    app.use("/vendor", VendorRoute);
    app.use("/customer", CustomerRoute);
    app.use("/delivery", DeliveryRoute);
    app.use(ShoppingRoute);

    return app;
}