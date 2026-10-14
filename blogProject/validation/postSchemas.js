const { z } = require("zod");

const postBody = z.object({
    title: z.string().trim().min(1).max(255),
    content: z.string().trim().min(1),
    published: z.boolean().optional()
});

const postIdParams = z.object({
    id: z.string().regex(/^[1-9]\d*$/, "Post ID must be a positive integer")
});

module.exports = {
    postBody,
    postIdParams
};
