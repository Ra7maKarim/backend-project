const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppDataSource = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res, next) => {
    try {
        const body = req.body || {};
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = body.password;

        if (!emailPattern.test(email) || typeof password !== "string" || password.length < 8) {
            return res.status(400).json({ message: "Enter a valid email and a password with at least 8 characters" });
        }

        const users = AppDataSource.getRepository("user");
        if (await users.findOneBy({ email })) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        const user = users.create({ email, password: await bcrypt.hash(password, 12) });
        const savedUser = await users.save(user);
        return res.status(201).json({
            message: "Account created successfully",
            user: { id: savedUser.id, email: savedUser.email }
        });
    } catch (error) {
        if (error.code === "23505") return res.status(409).json({ message: "Email is already registered" });
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const body = req.body || {};
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = body.password;
        if (!email || typeof password !== "string") {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await AppDataSource.getRepository("user").findOneBy({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ message: "Login successful", token, expiresIn: "1h" });
    } catch (error) {
        next(error);
    }
});

router.get("/me", authenticateToken, async (req, res, next) => {
    try {
        const user = await AppDataSource.getRepository("user").findOne({
            where: { id: req.user.id },
            select: { id: true, email: true }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json({ user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
