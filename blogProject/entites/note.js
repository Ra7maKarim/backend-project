
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "note",
    tableName: "note",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },

        title: {
            type: "varchar"
        },

        content: {
            type: "text"
        }
    }
});