import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { AdminRoute, VendorRoute } from "./routes/index";
import { MONGO_URI } from "./config";
import path from "path";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use("/images", express.static(path.join('images')));

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Hello from food order Backend!" });
});
app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

mongoose.connect(MONGO_URI)
.then(result => {
    console.log(`Mongo Connected Successfully`);
}).catch(err => console.log(`Mongo Connection error ${err}`));

// App Listen
app.listen(8000, () => {
    console.clear();
    console.log("App is listening to the port 8000");
});