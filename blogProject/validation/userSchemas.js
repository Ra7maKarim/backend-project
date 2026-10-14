const { z } = require("zod");

const userBody = z.object({
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(128)
});

module.exports = {
    userBody,
    userIdParams: z.object({ id: z.string().regex(/^[1-9]\d*$/, "User ID must be a positive integer") }),
    searchQuery: z.object({ email: z.string().trim().min(1).max(255) })
};
