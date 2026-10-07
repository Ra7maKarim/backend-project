const {DataSource} = require("pg");
const Note = require("./entites/note");
const User = require("./entites/user");

const AppDataSource = new DataSource({
    type: "postgres",
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    database: 'node_db',
    password: 'rori@2006',
    synchronize: true,
    logging: false,
    entities: [Note, User],
    migrations: [],
    subscribers: []
});

module.exports = pool;