import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Body parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/repos", repositoryRoutes);
app.use("/api/pr", aiRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;