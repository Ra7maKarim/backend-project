const express = require("express");
const AppDataSource = require("./db");
const { Like } = require("typeorm");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", require("./routes/auth"));

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

app.get("/", async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const users = await UserRepository.find();

    res.json(users);

});

app.get("/users/search", async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const name = req.query.name;

    const users = await UserRepository.find({
        where: {
            name: Like(`%${name}%`)
        }
    });

    res.json(users);

});

app.post("/users", async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const newUser = UserRepository.create(req.body);

    const savedUser = await UserRepository.save(newUser);

    res.status(201).json(savedUser);

});

app.put("/users/:id", async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const user = await UserRepository.findOneBy({
        id: parseInt(req.params.id)
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    UserRepository.merge(user, req.body);

    const updatedUser = await UserRepository.save(user);

    res.json(updatedUser);

});

app.delete("/users/:id", async (req, res) => {

    const UserRepository = AppDataSource.getRepository("user");

    const user = await UserRepository.findOneBy({
        id: parseInt(req.params.id)
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    await UserRepository.remove(user);

    res.status(204).send();

});
