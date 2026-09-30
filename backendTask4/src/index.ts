import express, { Request, Response } from "express";
import fs from "fs";

const app = express();

app.use(express.json());

const PORT = 5000;
const usersFile = "./users.json";

type User = {
    id: number;
    name: string;
    age: number;
};

app.get("/users", (req: Request, res: Response) => {
    try {
        const users: User[] = JSON.parse(
            fs.readFileSync(usersFile, "utf8")
        );

        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error reading users file"
        });
    }
});

app.post("/users", (req: Request, res: Response) => {
    try {
        const users: User[] = JSON.parse(
            fs.readFileSync(usersFile, "utf8")
        );

        const newUser: User = {
            id: users.length + 1,
            ...req.body
        };

        users.push(newUser);

        fs.writeFileSync(
            usersFile,
            JSON.stringify(users, null, 4)
        );

        res.status(201).json({
            message: "User added successfully",
            user: newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error processing users"
        });
    }
});

app.put("/users/:id", (req: Request, res: Response) => {
    try {
        const users: User[] = JSON.parse(
            fs.readFileSync(usersFile, "utf8")
        );

        const id = Number(req.params.id);

        const userIndex = users.findIndex(
            user => user.id === id
        );

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

        fs.writeFileSync(
            usersFile,
            JSON.stringify(users, null, 4)
        );

        res.json({
            message: "User updated successfully",
            user: users[userIndex]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error processing users"
        });
    }
});

app.delete("/users/:id", (req: Request, res: Response) => {
    try {
        const users: User[] = JSON.parse(
            fs.readFileSync(usersFile, "utf8")
        );

        const id = Number(req.params.id);

        const userIndex = users.findIndex(
            user => user.id === id
        );

        if (userIndex === -1) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        const deletedUser = users.splice(userIndex, 1)[0];

        fs.writeFileSync(
            usersFile,
            JSON.stringify(users, null, 4)
        );

        res.json({
            message: "User deleted successfully",
            user: deletedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error processing users"
        });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

