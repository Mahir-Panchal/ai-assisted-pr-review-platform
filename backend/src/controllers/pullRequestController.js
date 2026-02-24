import PullRequest from "../models/PullRequest.js";
import Repository from "../models/Repository.js";

// @desc Create Pull Request
// @route POST /api/repos/:repoId/pr
// @access Private
export const createPullRequest = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { repoId } = req.params;

        if (!title) {
            res.status(400);
            throw new Error("Title is required");
        }

        // Check repository exists
        const repo = await Repository.findById(repoId);

        if (!repo) {
            res.status(404);
            throw new Error("Repository not found");
        }

        const pr = await PullRequest.create({
            title,
            description,
            repository: repoId,
            author: req.user._id,
        });

        res.status(201).json(pr);
    } catch (error) {
        next(error);
    }
};

// @desc Get PRs of a repository
// @route GET /api/repos/:repoId/pr
// @access Private
export const getPullRequestsByRepo = async (req, res, next) => {
    try {
        const { repoId } = req.params;

        const prs = await PullRequest.find({ repository: repoId })
            .populate("author", "name email");

        res.json(prs);
    } catch (error) {
        next(error);
    }
};

// @desc Simulate AI Review
// @route POST /api/pr/:prId/review
// @access Private
export const reviewPullRequest = async (req, res, next) => {
    try {
        const { prId } = req.params;

        const pr = await PullRequest.findById(prId);

        if (!pr) {
            res.status(404);
            throw new Error("Pull Request not found");
        }

        if (pr.status !== "open") {
            res.status(400);
            throw new Error("PR already reviewed or closed");
        }

        // -------- AI SIMULATION LOGIC --------
        const text = pr.description?.toLowerCase() || "";

        let aiDecision;
        let aiComment;

        if (
            text.includes("fix") ||
            text.includes("improve") ||
            text.includes("optimize")
        ) {
            aiDecision = "approved";
            aiComment =
                "AI Review: Code improvements detected. Structure looks clean. Approved for merge.";
        } else {
            aiDecision = "changes_requested";
            aiComment =
                "AI Review: Missing improvements or insufficient clarity. Please refine implementation.";
        }

        pr.status = aiDecision;
        pr.aiReviewComment = aiComment;
        pr.reviewedAt = new Date();

        // Auto-merge if approved
        if (aiDecision === "approved") {
            pr.status = "merged";
            pr.mergedAt = new Date();
            pr.mergedByAI = true;
        }

        await pr.save();

        res.json({
            message: "AI review completed",
            pr,
        });
    } catch (error) {
        next(error);
    }
};