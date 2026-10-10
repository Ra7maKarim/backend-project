require("dotenv").config();
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "node_db",
    synchronize: process.env.NODE_ENV !== "production",
    logging: false,
    entities: [require("./entites/note"), require("./entites/user")]
});

module.exports = AppDataSource;
