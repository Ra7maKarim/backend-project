const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppDataSource = require("../db");
const authenticateToken = require("../middleware/auth");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validation/authSchemas");

const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res, next) => {
    try {
        const { email: rawEmail, password } = req.body;
        const email = rawEmail.trim().toLowerCase();

        const users = AppDataSource.getRepository("user");
        if (await users.findOneBy({ email })) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        const user = users.create({ email, password: await bcrypt.hash(password, 12), role: "user" });
        const savedUser = await users.save(user);
        return res.status(201).json({
            message: "Account created successfully",
            user: { id: savedUser.id, email: savedUser.email, role: savedUser.role }
        });
    } catch (error) {
        if (error.code === "23505") return res.status(409).json({ message: "Email is already registered" });
        next(error);
    }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
    try {
        const { email: rawEmail, password } = req.body;
        const email = rawEmail.trim().toLowerCase();

        const user = await AppDataSource.getRepository("user").findOneBy({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ message: "Login successful", accessToken, tokenType: "Bearer", expiresIn: "1h" });
    } catch (error) {
        next(error);
    }
});

router.get("/me", authenticateToken, async (req, res, next) => {
    try {
        const user = await AppDataSource.getRepository("user").findOne({
            where: { id: req.user.id },
            select: { id: true, email: true, role: true }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json({ user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
