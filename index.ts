import express from "express";
import App from "./services/ExpressApp";
import dbConnection from './services/Database';
import { PORT } from "./config";

const StartServer = async () => {
    const app = express();

    await dbConnection();

    await App(app);

    // App Listen
    app.listen(PORT, () => {
        console.log(`App is listening to the port ${PORT}`);
    });
}

StartServer();