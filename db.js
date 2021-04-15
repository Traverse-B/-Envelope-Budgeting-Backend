// *************************************************************************//
//      Persistent Database for the Personal Budgeting Website              //
// *************************************************************************//

/*  This module contains the database object (db) that contains the array of
    website users (and the class definition that creates User objects)  
    as well as methods to create, retrieve, update and delete user objects.
    
    The user objects themselves contain methods to create, retrieve, update and
    delete the "envelopes" that contain budgeting information. Thus, any number
    of users can be assigned to this website, each with their own set of 
    budgeting "envelopes".

    The db is set up with a method to save the state of the user array to the 
    associated users.json file, which persists even when the server is down.  
    All changes to the array or the objects it contains are automatically saved
    using this method.  Opening the server initializes the database, retrieving
    the user array and creating the required user objects, returning it to its
    previous state.

    The database can be reset (for testing purposes) using the db.resetDB
    method.
*/

class User {

    constructor(firstName, lastName, email, userID, secret, pay, payday, frequency) {
        
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userID = userID;
        this.secret = secret;
        this.pay = pay;
        this.payday = payday;
        this.frequency = frequency;
        this.envelopes = [];
        this.currentID = 0;
        this.savings = 0

    }

    updateUser(type, info) {
        if (type === 'firstName') {
            if (typeof info !== 'string' || info.length === 0) return false;
            this.firstName = info;
        } else if (type === 'lastName') {
            if (typeof info !== 'string' || info.length === 0) return false;
            this.lastName = info;
        } else if (type === 'email') {
            if (typeof info !== 'string') return false;
            if (!info.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
                return false;
            }
            this.email = info;
        } else if (type === 'userID') {
            if (typeof info !== 'string' || info.length === 0) return false;
            if (db.getUserByUserID(info)) return false;
            this.userID = info;
        } else if (type === 'secret') {
            if (typeof info !== 'string' || info.length === 0) return false;
            this.secret = info;
        } else if (type === 'pay') {
            if (typeof info !== 'number') return false;
            this.pay = info;
        } else if (type === 'payday') {
            if (typeof info !== 'string' || info.length === 0) return false; //<-- Change
            this.payday = info;
        } else if (type === 'frequency') {
            if (typeof info !== 'number') return false;
            this.frequency === info;
        } else {
            return false;
        }
        const saved = db.save();
        return saved;
    }

    getEnvelopeByID(id) {
        const envelope = this.envelopes.filter(env => env.id == id)[0];
        if (envelope) {
            return envelope;
        } else {
            return false
        }
    }

    getEnvelopeByCategory(category) {
        const envelope = this.envelopes.filter(env => env.category === category)[0];
        if (envelope) {
            return envelope;
        } else {
            return false
        } 
    }

    createEnvelope(category, deposit) {
        if (this.getEnvelopeByCategory(category).length > 0) {
            return false;
        } 
        let envelope = {
            category: category,
            amount: 0,
            deposit: deposit,
            id: this.currentID += 1
        }
        this.envelopes.push(envelope);
        const saved = db.save();
        if (saved) {
            return envelope;
        } else {
            return false;
        }
    }

    deleteEnvelope(id) {
        if (this.getEnvelopeByID(id)) {
            this.envelopes = this.envelopes.filter(obj => obj.id !== id);
            const saved = db.save();
            return saved;
        } else {
            return false;
        }
    }

    updateEnvelope(id, type, info) {
        let envelope = this.getEnvelopeByID(id);
        if (type === 'category') {
            if (typeof info !== 'string' || info.length === 0) return false;
            envelope.category = info;
            return envelope;
        } else if (type === 'deposit') {
            if (typeof info !== 'number') return false;
            envelope.deposit = info;
            const saved = db.save();
            return envelope;
        } else {
            return false;
        }
    }

    paydayDeposit(amount) {
        let cash = amount || this.pay;
        this.envelopes.forEach(envelope => {
            envelope.amount += envelope.deposit;
            cash -= envelope.deposit;
        })
        this.savings += cash;
        const saved = db.save();
        return saved
    }

    updateAmount(envelopeID, amount) {
        const envelope = this.getEnvelopeByID(envelopeID);
        if (envelope && typeof amount === 'number') {
            const balance = envelope.amount + amount;
            if (balance < 0) return false;
            envelope.amount = balance;
            const saved = db.save();
            return saved;
        }
    }



    transfer(senderID, targetID, amount) {
        const sender = this.getEnvelopeByID(senderID);
        const target = this.getEnvelopeByID(targetID);
        if (!sender || !target || typeof amount !== 'number') return false;
        if (sender.amount < amount) return false;
        sender.amount -= amount;
        target.amount += amount;
        const saved = db.save();
        return saved;
    }

}


const fs = require('fs');

const db = {

    users: [],

    initialize: function() {
        users = require('./users');
        users.forEach(user => {
            let loaded = new User(user.firstName, user.lastName, user.email, user.userID, user.secret, user.pay, user.payday, user.frequency);
            loaded.currentID = user.currentID;
            loaded.savings = user.savings;
            loaded.envelopes = [];
            user.envelopes.forEach(env => loaded.envelopes.push(env));
            this.users.push(loaded);
        })
        console.log('Database Online');
        this.users.forEach(user => {
            console.log(`Username: ${user.userID}, Envelopes:`)
            user.envelopes.forEach(envelope => console.log(envelope));
        })
    },
    
    save: async function() {
        const saved = await fs.writeFile('users.json', JSON.stringify(this.users), err => {
            if (err) throw err;
            return true;
        })
        return true;
    },

    resetDB: function() {
        this.users = [];
        const saved = this.save();
        return saved;
    },

    getUserByUserID: function(userID) {
        const user = this.users.filter(user => user.userID === userID)[0];
        if (user) {
            return user;
        } else {
            return false;
        }
    },

    createUser: function(firstName, lastName, email, userID, secret, pay, payday, frequency) {
        console.log(this.users)
        if (this.getUserByUserID(userID)) return false;
        if (typeof firstName !== 'string' || firstName.length === 0) return false;
        if (typeof lastName !== 'string' || lastName.length === 0) return false;
        if (!email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
            return false;
        }
        if (typeof userID !== 'string' || userID.length === 0) return false;
        if (typeof secret !== 'string' || userID.length === 0) return false;
        if (typeof pay !== 'number' || pay <= 0) return false;
        if (typeof payday !== 'string') return false;
        if (typeof frequency !== 'number' || frequency <= 0) return false;
        const newUser = new User(firstName, lastName, email, userID, secret, pay, payday, frequency);
        this.users.push(newUser);
        saved = this.save();
        if (saved) {
            return newUser;
        } else {
            return false;
        }
    },

    deleteUser: function(userID) {
        if (this.getUserByUserID(userID)) {
            this.users = this.users.filter(user => user.userID !== userID);
            const saved = this.save();
            return saved;
        } else {
            return false;
        }
    }

}


module.exports = db;


