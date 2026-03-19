import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import pullRequestRoutes from "./routes/pullRequestRoutes.js";  // was missing
import aiRoutes from "./routes/aiRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// CORS — allow frontend origin (tighten in production)
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

// Body parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/repos", repositoryRoutes);
app.use("/api/repos", pullRequestRoutes);   // PR routes are repo-scoped: /api/repos/:repoId/pr
app.use("/api/pr", aiRoutes);               // AI review route: /api/pr/:prId/review

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;