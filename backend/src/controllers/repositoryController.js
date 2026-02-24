import Repository from "../models/Repository.js";

// @desc Create repository
// @route POST /api/repos
// @access Private
export const createRepository = async (req, res, next) => {
    try {
        const { name, description, isPrivate } = req.body;

        if (!name) {
            res.status(400);
            throw new Error("Repository name is required");
        }

        const repo = await Repository.create({
            name,
            description,
            isPrivate,
            owner: req.user._id,
        });

        res.status(201).json(repo);
    } catch (error) {
        next(error);
    }
};

// @desc Get logged in user's repositories
// @route GET /api/repos
// @access Private
export const getUserRepositories = async (req, res, next) => {
    try {
        const repos = await Repository.find({ owner: req.user._id });

        res.json(repos);
    } catch (error) {
        next(error);
    }
};