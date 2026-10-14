const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "post",
    tableName: "posts",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },

        title: {
            type: "varchar",
            length: 255
        },

        content: {
            type: "text"
        },

        published: {
            type: "boolean",
            default: false
        },

        authorId: {
            type: "int"
        },

        createdAt: {
            type: "timestamp",
            createDate: true
        },

        updatedAt: {
            type: "timestamp",
            updateDate: true
        }
    }
});
