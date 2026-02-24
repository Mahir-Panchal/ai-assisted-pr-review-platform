import mongoose from "mongoose";

const repositorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Repository = mongoose.model("Repository", repositorySchema);

export default Repository;