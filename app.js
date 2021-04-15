const express = require('express');
const app = express();
const db = require('./db');
const userRouter = require('./user');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

/* 
    In shell, the command "node app.js" initializes the database, loads 
    necessary middleware (including the user router), and starts the server.
*/

// Open Database 
db.initialize(); 

// Load bodyParser middleware
app.use(bodyParser.json());

// Send user router to userRouter
app.use('/user', userRouter);

// Start Server
app.listen(PORT, console.log(`Server listening at ${PORT}`));