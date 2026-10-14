const { z } = require("zod");

const email = z.string().trim().email().max(255);

module.exports = {
    registerSchema: z.object({
        email,
        password: z.string().min(8).max(128)
    }),
    loginSchema: z.object({
        email,
        password: z.string().min(1).max(128)
    })
};
