// // Import express and ejs
// var express = require ('express')
// var session = require ('express-session')
// var validator = require ('express-validator');
// var ejs = require('ejs')
// const expressSanitizer = require('express-sanitizer');


// //Import mysql module
// var mysql = require('mysql2')


// // Create the express application object
// const app = express()
// const port = 8000

// // Tell Express that we want to use EJS as the templating engine
// app.set('view engine', 'ejs')

// // Set up the body parser 
// app.use(express.urlencoded({ extended: true }))

// // Set up public folder (for css and statis js)
// app.use(express.static(__dirname + '/public'))

// //create a session
// app.use(session({
//     secret: 'somerandomstuff',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         expires: 600000
//     }
// }))

// //create an input sanitizer
// app.use(expressSanitizer());


// // Define the database connection
// const db = mysql.createConnection ({
//     host: 'localhost',
//     user: 'aero_scope_app',
//     password: 'qwertyuiop',
//     database: 'aero_scope'
// })
// // Connect to the database
// db.connect((err) => {
//     if (err) {
//         throw err
//     }
//     console.log('Connected to database')
// })
// global.db = db

// // Define our application-specific data
// app.locals.shopData = {shopName: "Aero Scopes"}

// // Load the route handlers
// const mainRoutes = require("./routes/main")
// app.use('/', mainRoutes)

// // Load the route handlers for /users
// const usersRoutes = require('./routes/users')
// app.use('/users', usersRoutes)

// // Load the route handlers for /flights
// const flightsRoutes = require('./routes/flights')
// app.use('/flights', flightsRoutes)

// // Start the web app listening
// app.listen(port, () => console.log(`Node app listening on port ${port}!`))

// Import required modules
var express = require('express');
var session = require('express-session');
var validator = require('express-validator');
var ejs = require('ejs');
const expressSanitizer = require('express-sanitizer');
var mysql = require('mysql2');

// Create the express application object
const app = express();
const port = 8000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set up body parser for URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set up public folder for static assets (CSS/JS)
app.use(express.static(__dirname + '/public'));

// Create a session for user authentication
app.use(session({
    secret: 'somerandomstuff', 
    resave: false, 
    saveUninitialized: false,
    cookie: { expires: 600000 } // Session expires in 10 minutes
}));

// Create an input sanitizer to prevent malicious data
app.use(expressSanitizer());

// Define the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'aero_scope_app',
    password: 'qwertyuiop',
    database: 'aero_scope'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database');
});

// Make the db connection accessible globally
global.db = db;

// Define application-specific data (e.g., shop name)
app.locals.shopData = { shopName: "Aero Scopes" };

// Load the route handlers for the main page, users, and flights
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const flightsRoutes = require('./routes/flights');
app.use('/flights', flightsRoutes);

// Start the web server and listen on the specified port
app.listen(port, () => {
    console.log(`Node app listening on port ${port}!`);
});
