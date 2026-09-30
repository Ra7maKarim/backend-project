"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 5000;
const usersFile = "./users.json";
app.get("/users", (req, res) => {
    try {
        const users = JSON.parse(fs_1.default.readFileSync(usersFile, "utf8"));
        res.json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error reading users file"
        });
    }
});
app.post("/users", (req, res) => {
    try {
        const users = JSON.parse(fs_1.default.readFileSync(usersFile, "utf8"));
        const newUser = {
            id: users.length + 1,
            ...req.body
        };
        users.push(newUser);
        fs_1.default.writeFileSync(usersFile, JSON.stringify(users, null, 4));
        res.status(201).json({
            message: "User added successfully",
            user: newUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error processing users"
        });
    }
});
app.put("/users/:id", (req, res) => {
    try {
        const users = JSON.parse(fs_1.default.readFileSync(usersFile, "utf8"));
        const id = Number(req.params.id);
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        users[userIndex] = {
            ...users[userIndex],
            ...req.body,
            id: id
        };
        fs_1.default.writeFileSync(usersFile, JSON.stringify(users, null, 4));
        res.json({
            message: "User updated successfully",
            user: users[userIndex]
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error processing users"
        });
    }
});
app.delete("/users/:id", (req, res) => {
    try {
        const users = JSON.parse(fs_1.default.readFileSync(usersFile, "utf8"));
        const id = Number(req.params.id);
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        const deletedUser = users.splice(userIndex, 1)[0];
        fs_1.default.writeFileSync(usersFile, JSON.stringify(users, null, 4));
        res.json({
            message: "User deleted successfully",
            user: deletedUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error processing users"
        });
    }
});
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
