import mongoose from "mongoose";

const pullRequestSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        repository: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Repository",
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["open", "changes_requested", "approved", "merged"],
            default: "open",
        },
        aiReviewComment: {
            type: String,
        },
        reviewedAt: {
            type: Date,
        },
        mergedAt: {
            type: Date,
        },
        mergedByAI: {
            type: Boolean,
            default: false,
        },
        aiScore: {
            type: Number
        },
        filesChanged: {
            type: Number,
            default: 1
        },
        linesAdded: {
            type: Number,
            default: 0
        },
        linesRemoved: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
    }
);

const PullRequest = mongoose.model("PullRequest", pullRequestSchema);

export default PullRequest;