import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { reviewPullRequest } from "../controllers/pullRequestController.js";

const router = express.Router();

router.post("/:prId/review", protect, reviewPullRequest);

export default router;