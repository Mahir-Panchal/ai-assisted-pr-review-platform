import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import pullRequestRoutes from "./pullRequestRoutes.js";
import {
    createRepository,
    getUserRepositories,
} from "../controllers/repositoryController.js";

const router = express.Router();

router.route("/")
    .post(protect, createRepository)
    .get(protect, getUserRepositories);

router.use("/:repoId/pr", pullRequestRoutes);
export default router;