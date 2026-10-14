const express = require("express");
const AppDataSource = require("./db");
const { Like } = require("typeorm");
const bcrypt = require("bcrypt");
const authenticateToken = require("./middleware/auth");
const requireRole = require("./middleware/requireRole");
const requireUser = require("./middleware/requireUser");
const validate = require("./middleware/validate");
const { userBody, userIdParams, searchQuery } = require("./validation/userSchemas");
const errorHandler = require("./errorHandler");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

app.get("/", authenticateToken, async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const users = await UserRepository.find({ select: { id: true, email: true, role: true } });

    res.json(users);

});

app.get("/users/search", authenticateToken, validate(searchQuery, "query"), async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const email = req.query.email;

    const users = await UserRepository.find({
        select: { id: true, email: true, role: true },
        where: {
            email: Like(`%${email}%`)
        }
    });

    res.json(users);

});

app.post("/users", authenticateToken, requireRole("admin"), validate(userBody), async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const newUser = UserRepository.create({
        email: req.body.email.toLowerCase(),
        password: await bcrypt.hash(req.body.password, 12),
        role: "user"
    });

    const savedUser = await UserRepository.save(newUser);

    res.status(201).json({ id: savedUser.id, email: savedUser.email, role: savedUser.role });

});

app.put("/users/:id", authenticateToken, requireRole("admin"), validate(userIdParams, "params"), validate(userBody), async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const user = await UserRepository.findOneBy({
        id: Number(req.params.id)
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.email = req.body.email.toLowerCase();
    user.password = await bcrypt.hash(req.body.password, 12);

    const updatedUser = await UserRepository.save(user);

    res.json({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role });

});

app.delete("/users/me", authenticateToken, requireUser, async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");
    const user = await UserRepository.findOneBy({ id: req.user.id });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await UserRepository.remove(user);
    res.status(204).send();

});

app.delete("/users/:id", authenticateToken, requireRole("admin"), validate(userIdParams, "params"), async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const user = await UserRepository.findOneBy({
        id: Number(req.params.id)
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    await UserRepository.remove(user);

    res.status(204).send();

});

app.use(errorHandler);
