import { app, PORT } from "./app.js";
import mongoose from "mongoose";

console.log("Starting server...");

const StartServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase");
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.log("Error starting server:", error);
    }
}

StartServer();

// NOTES:

// ESM === ECMAScript Modules