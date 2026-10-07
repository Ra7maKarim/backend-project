const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {

    try {
        const result = await pool.query("SELECT * FROM users");

        res.json(result.rows);

    } catch (err) {

        res.status(500).json({
            message: "Error fetching users"
        });

    }

});

app.get("/users/search", async (req, res) => {

    try {
        const name = req.query.name;

        const result = await pool.query(
            "SELECT * FROM users WHERE name ILIKE $1",
            [`%${name}%`]
        );

        res.json(result.rows);

    } catch (err) {

        res.status(500).json({
            message: "Error searching users"
        });

    }

});

app.post("/users", async (req, res) => {

    try {

        const { name, age } = req.body;

        const result = await pool.query(
            "INSERT INTO users (name, age) VALUES ($1, $2) RETURNING *",
            [name, age]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {

        res.status(500).json({
            message: "Error creating user"
        });

    }

});

app.put("/users/:id", async (req, res) => {

    try {

        const id = parseInt(req.params.id);
        const { name, age } = req.body;

        const result = await pool.query(
            "UPDATE users SET name = $1, age = $2 WHERE id = $3 RETURNING *",
            [name, age, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (err) {

        res.status(500).json({
            message: "Error updating user"
        });

    }

});

app.delete("/users/:id", async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (err) {

        res.status(500).json({
            message: "Error deleting user"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});