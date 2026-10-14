const express = require("express");
const AppDataSource = require("../db");
const authenticateToken = require("../middleware/auth");
const validate = require("../middleware/validate");
const { postBody, postIdParams } = require("../validation/postSchemas");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const posts = await AppDataSource.getRepository("post").find({
            where: { published: true },
            order: { createdAt: "DESC" }
        });

        return res.json({ posts });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", validate(postIdParams, "params"), async (req, res, next) => {
    try {
        const post = await AppDataSource.getRepository("post").findOneBy({
            id: Number(req.params.id),
            published: true
        });

        if (!post) return res.status(404).json({ message: "Post not found" });
        return res.json({ post });
    } catch (error) {
        next(error);
    }
});

router.post("/", authenticateToken, validate(postBody), async (req, res, next) => {
    try {
        const posts = AppDataSource.getRepository("post");
        const post = posts.create({
            title: req.body.title,
            content: req.body.content,
            published: req.body.published || false,
            authorId: req.user.id
        });

        return res.status(201).json({ post: await posts.save(post) });
    } catch (error) {
        next(error);
    }
});

router.put("/:id", authenticateToken, validate(postIdParams, "params"), validate(postBody), async (req, res, next) => {
    try {
        const posts = AppDataSource.getRepository("post");
        const post = await posts.findOneBy({ id: Number(req.params.id) });

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.authorId !== req.user.id) return res.status(403).json({ message: "You can only update your own posts" });

        post.title = req.body.title;
        post.content = req.body.content;
        if (req.body.published !== undefined) post.published = req.body.published;

        return res.json({ post: await posts.save(post) });
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", authenticateToken, validate(postIdParams, "params"), async (req, res, next) => {
    try {
        const posts = AppDataSource.getRepository("post");
        const post = await posts.findOneBy({ id: Number(req.params.id) });

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.authorId !== req.user.id) return res.status(403).json({ message: "You can only delete your own posts" });

        await posts.remove(post);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
