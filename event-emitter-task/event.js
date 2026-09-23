const EventEmitter = require("events");

const myEmitter = new EventEmitter();

let content1;
let content2;

let file1Done = false;
let file2Done = false;

myEmitter.on("file1Read", (data) => {
    content1 = data;
    file1Done = true;

    if (file1Done && file2Done) {
        myEmitter.emit("bothFilesRead");
    }
});

myEmitter.on("file2Read", (data) => {
    content2 = data;
    file2Done = true;

    if (file1Done && file2Done) {
        myEmitter.emit("bothFilesRead");
    }
});

myEmitter.on("bothFilesRead", () => {
    const mergedContent = content1 + "\n" + content2;

    const fs = require("fs");

    fs.writeFile(
        "file3.txt",
        mergedContent,
        "utf8",
        (err) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log("Files merged successfully!");
        }
    );
});

module.exports = myEmitter;