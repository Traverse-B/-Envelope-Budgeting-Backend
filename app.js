const express = require('express');
const app = express();
const db = require('./db');
const userRouter = require('./user');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/user', userRouter);

app.listen(PORT, console.log(`Server listening at ${PORT}`));