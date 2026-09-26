const http = require('http');

const users = [
    { id: 1, name: "Rahma", age: 21 },
    { id: 2, name: "Haneen", age: 19 },
    { id: 3, name: "Menna", age: 18 }
];

const products = [
    { id: 1, name: "Laptop", price: 30000 },
    { id: 2, name: "Phone", price: 15000 },
    { id: 3, name: "Headphones", price: 2000 }
];

const server = http.createServer((req, res) => {

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    if (req.url === '/' && req.method === 'GET') {
        res.end(JSON.stringify({
            message: "Welcome to home page!"
        }));
    }
    else if (req.url === '/users' && req.method === 'GET') {
        res.end(JSON.stringify(users));
    }
    else if (req.url === '/products' && req.method === 'GET') {
        res.end(JSON.stringify(products));
    }
    else if(req.url === '/users' && req.method === 'POST') {
        let data = "";

        req.on("data", (chunk) => {
                data+=chunk;
            });
        req.on("end", ()=>{
            const userData = JSON.parse(data);

            const newUser = {
                id: users.length + 1,
                ...userData
            };

            users.push(newUser);

            res.statusCode = 201;

            res.end(JSON.stringify({
                message: "User added successfully",
                user: newUser
            }));
        });   
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({
            message: "Route not found"
        }));
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});