import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(process.env.PORT || 5000, () =>
            console.log(`Server running on port ${process.env.PORT || 5000}`)
        );
    })
    .catch((err) => {
        console.error(err);
    });