const myEmitter = require("./event");
const fs = require("fs");

fs.readFile(
    "file1.txt",
    "utf8",
    (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(data);

        myEmitter.emit("file1Read", data);
    }
);

fs.readFile(
    "file2.txt",
    "utf8",
    (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(data);

        myEmitter.emit("file2Read", data);
    }
);