# Envelope-Budgeting-Backend

For your viewing pleasure:  A RESTful API with a persistent, home-brewed database using node.js and Express 


## Introduction

The Envelope Budgeting Backend is a toy API created with Node.js and Express to demonstrate my ability to build, debug, and maintain the backend of a functional website.  

The Envelope Budgeting Backend is a RESTful API that allows one to create user accounts and build a budgeting profile for each user based on "envelope" objects that maintain balances for different purposes and can be updated to deposit, withdraw, or transfer funds.

The Envelope Budgeting Backend comes with a working database that automatically maintains a back-up of all data in a .json file so the server can be turned off and on without losing data.  

All routes have been tested for correct responses to requests with proper as well as improper data.  The project is several steps short of production, but is a good representation of my skills with Express and node.js.

## Installation

Download files and use shell or bash to navigate to the root folder "Envelope-Budgeting-Backend".

Use the command `node app.js` to initialize the database and start the router.

The server is located at http://localhost:3000.  One can test the routes with Postman or another third party. I tested all routes using the extension REST Client for VS Code.  Included is the test.http file with many sample requests representing "happy" and "sad" paths, in case you wish to do the same -- simply install the extension, open the test.http file in VS Code and click on "Request" to try out a route.


## Features

The included routes allow one to create, retrieve, modify and delete any number of user accounts.  Within each account, routes are provided to create, retrieve, modify and delete any number of personal budgeting "envelopes" objects, each with a specified budgeting category (ie "groceries", "vacation", etc) and a balance that represents funds allocated for that purpose.  Functionality is provided to deposit or withdraw funds from envelopes to represent spending in various categories.  Functionality is also provided to transfer funds from one "envelope" to another .  All of this is designed to assist a user with personal finances and planning.  

The functionality with the routes works seemlessly with the database, which provides a User class and methods for creating, retrieving, modifying and deleting users.  The user objects themselves contain methods for creating, retrieving, modifying and deleting "envelope" objects.  The database is designed to automatically save essential information about the users and envelopes in a users.json file, so that data is preserved even when the server is down.  Checks at every step ensure that data is correct.  A route is included to "reset" the database for testing purposes, as data will persist after the server is stopped and restarted.  

## Technologies Used

- Express
- npm
- Node.js

## Acknowledgements

- Many thanks to Huachao Mao for the invaluable REST Client
