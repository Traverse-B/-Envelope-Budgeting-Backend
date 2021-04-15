const express = require('express');
const userRouter = express.Router();
const db = require('./db');
const envelopeRouter = require('./envelopes');

/*
    The user router handles all routes related to website user accounts,
    including creating, updating & deleting user accounts.  User
    accounts also contain the budgeting "envelope" objects that are the 
    focus of this website.  Routes involving user envelopes are passed to
    the envelope router.
*/

// Clear Database (Mostly for testing purposes)
userRouter.delete('/all', (req, res, next) => {
    const ready = db.resetDB();
    if (ready) {
        res.send();
    } else {
        res.status(500).send();
    }
})

// Retrieve user information or return 404
userRouter.param('userID', (req, res, next, id) => {
    const user = db.getUserByUserID(id);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(404).send();
    }
});

// Get all Users
userRouter.get('/', (req, res, next) => {
    res.send(db.users.slice(0));
});

// Get User by UserID
userRouter.get('/:userID', (req, res, next) => {
    res.send(req.user);
});

// Create User
userRouter.post('/', (req, res, next) => {
    user = db.createUser (
        req.body.firstName, 
        req.body.lastName, 
        req.body.email, 
        req.body.userID, 
        req.body.secret, 
        req.body.pay, 
        req.body.payday, 
        req.body.frequency
    );
    if (user) {
        res.status(201).send(user);
    } else {
        res.status(400).send();
    }
});

// Update user by ID
userRouter.put('/:userID', (req, res, next) => {
    user = req.user;
    const updated = user.updateUser(req.body.type, req.body.info);
    if (updated) {
        res.status(201).send(user);
    } else {
        res.status(400).send();
    }
});

// Delete user by ID
userRouter.delete('/:userID', (req, res, next) => {
    deleted = db.deleteUser(req.user.userID);
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
});

// Pass envelope routes to envelopeRouter
userRouter.use('/:userID/envelopes', envelopeRouter);

module.exports = userRouter;