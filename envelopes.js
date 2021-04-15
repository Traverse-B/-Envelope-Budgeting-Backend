const express = require('express');
const envelopeRouter = express.Router();
const db = require('./db');

/*
    The Envelope Router handles all routes related to creating, retrieving,
    updating, and deleting the budgeting "envelopes" that are the core 
    functionality of this site.  
*/

// Retrieve envelope information or return 404
envelopeRouter.param('ID', (req, res, next, id) => {
    id = Number(id)
    if (typeof id !== 'number') {
        res.status(404).send();
    } else {
        const envelope = req.user.getEnvelopeByID(id);
        if (!envelope) {
            res.status(404).send();
        } else {
            req.envelope = envelope;
            next();
        }
    }
})


// Validate data (for post route)
function validateData(req, res, next) {
    let category = req.body.category;
    let deposit = req.body.deposit;
    // if data is invalid type or not present
    if (typeof req.body.category !== 'string' || typeof req.body.deposit !== 'number') {
        res.sendStatus(400);
    // If data is a blank string
    } else if (req.body.category.length === 0) {
        res.sendStatus(400);
    // if data includes script marker    
    } else if (req.body.category.match(/(<script>)/i)) {
        res.sendStatus(400);
    // if category already exsists
    } else if (req.user.getEnvelopeByCategory(req.body.category)) {
        res.status(409).send("Category already exsists");
    // Looks good!
    } else {
        next();
    }
}


// Get all envelopes
envelopeRouter.get('/', (req, res, next) => {
    res.send(req.user.envelopes.slice(0));
})

// Create an envelope
envelopeRouter.post('/', validateData, (req, res, next) => {
    let newEnvelope = req.user.createEnvelope(req.body.category, req.body.deposit);
    if (newEnvelope) {
        res.status(201).send(newEnvelope);
    } else {
        res.sendStatus(400);
    }
})

// Get envelope by ID
envelopeRouter.get('/:ID', (req, res, next) => {
    res.send(req.envelope);
})

// Update envelope by ID
envelopeRouter.put('/:ID', (req, res, next) => {
    const updated = req.user.updateEnvelope(req.envelope.id, req.body.type, req.body.info);
    if (updated) {
        res.status(201).send(updated);
    } else {
        res.status(400).send();
    }
})

// Delete envelope
envelopeRouter.delete('/:ID', (req, res, send) => {
    const deleted = req.user.deleteEnvelope(req.envelope.id);
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
})

// Make a deposit or withdraw 
envelopeRouter.put('/:ID/deposit', (req, res, next) => {
    const deposited = req.user.updateAmount(req.envelope.id, req.body.amount);
    if (deposited) {
        res.status(201).send(req.envelope);
    } else {
        res.status(404).send();
    }
})

// Make a transfer 
envelopeRouter.post('/:ID/sendto/:targetID', (req, res, next) => {
    const transferred = req.user.transfer(req.envelope.id, req.params.targetID, req.body.amount);
    if (transferred) {
        res.status(201).send();
    } else {
        res.status(400).send();
    }
})

module.exports = envelopeRouter;