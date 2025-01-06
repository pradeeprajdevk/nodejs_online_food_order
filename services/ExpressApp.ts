import express, { Application } from "express";
import bodyParser from "body-parser";
import { AdminRoute, ShoppingRoute, VendorRoute } from "../routes/index";
import path from "path";

export default async (app: Application) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use("/images", express.static(path.join('images')));

    // Routes
    app.get("/", (req, res) => {
        res.json({ message: "Hello from food order Backend!" });
    });
    app.use("/admin", AdminRoute);
    app.use("/vendor", VendorRoute);
    app.use(ShoppingRoute);

    return app;
}