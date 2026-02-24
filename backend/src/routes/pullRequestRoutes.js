import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createPullRequest,
    getPullRequestsByRepo,
} from "../controllers/pullRequestController.js";

const router = express.Router({ mergeParams: true });

router.route("/")
    .post(protect, createPullRequest)
    .get(protect, getPullRequestsByRepo);

export default router;