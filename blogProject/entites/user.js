const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "user",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },

        email: {
            type: "varchar",
            unique: true
        },

        password: {
            type: "varchar"
        },
        role: {
            type: "varchar",
            default: "user"
        }
    }
});
