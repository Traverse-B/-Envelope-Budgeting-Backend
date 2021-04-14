const db = require('./db');

// create a user
let user = db.createUser('Brian', 'Batcheldor', 'smo@boosh.com', 'IamAUser', 'Password', 2000, 'date', 7)

// create two envelopes for the user
env = user.createEnvelope('fun', 900)
user.createEnvelope('business', 800)
// check that user will get an envelope by id
//console.log(user.getEnvelopeByID(2));
// make a deposit
user.deposit()
// update the envelope
user.updateEnvelope(1, 'category', 'serious business');
// delete an envelope
user.deleteEnvelope(2)
// verify functionality
//console.log(user)

// create a second user
const user2 = db.createUser('Bethany', 'Borgemenke', 'girl@hot.com', 'hotUser', 'Password2', 4000, 'date', 14);
user2.updateUser('email', 'wife@hottie.com');
console.log(user2)
db.deleteUser('hotUser')
console.log(db.users)
