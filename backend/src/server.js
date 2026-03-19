import dotenv from "dotenv";
import connectDB from "./config/db.js";   // use the utility that already exists
import app from "./app.js";

dotenv.config();

connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});