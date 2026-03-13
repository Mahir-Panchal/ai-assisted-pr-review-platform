import PullRequest from "../models/PullRequest.js";
import Repository from "../models/Repository.js";
import { simulateAIReview } from "../services/aiReviewService.js";

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

        const { prId } = req.params

        const pr = await PullRequest.findById(prId)

        if (!pr) {
            res.status(404)
            throw new Error("Pull request not found")
        }

        if (pr.status !== "open") {
            res.status(400)
            throw new Error("PR already reviewed")
        }

        const { decision, comment, score } =
            simulateAIReview(pr.title, pr.description)

        pr.aiReviewComment = comment
        pr.aiScore = score
        pr.reviewedAt = new Date()

        if (decision === "approved") {

            pr.status = "merged"
            pr.mergedAt = new Date()
            pr.mergedByAI = true

        } else {

            pr.status = "changes_requested"

        }

        await pr.save()

        res.json({
            message: "AI review completed",
            score,
            status: pr.status,
            comment
        })

    } catch (error) {
        next(error)
    }
};