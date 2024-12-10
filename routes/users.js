// Create a new router
const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const saltRounds = 10
const { check, validationResult } = require('express-validator');


const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


router.get('/login', function (req, res, next) {
    res.render('login');  // This will load the login.ejs form
});

router.post('/loggedin', function (req, res, next) {
    const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        
    const username = req.body.username;
    const plainPassword = req.body.password;

    // Query the database to get the user's hashed password
    let sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            return next(err);
        }

        if (result.length === 0) {
            return res.send('Username not found.');
        }


        const hashedPassword = result[0].hashedPassword;

        // Compare the supplied password with the stored hashed password
        bcrypt.compare(plainPassword, hashedPassword, function(err, match) {
            if (err) {
                return next(err);
            }

            if (match) {
                // Save user session here, when login is successful
                req.session.userId = req.body.username;
                // Passwords match
                // res.send(`Welcome back, ${username}! You have successfully logged in.`);
                req.session.userId = req.body.username;
                return res.redirect('/');
            } else {
                // Passwords don't match
                res.send('Incorrect password.');
            }
        });
    });
});

// router.get('/logout', redirectLogin, (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             console.error('Error destroying session:', err);
//             return res.redirect('/');  // Redirect if there's an error
//         }
//         res.redirect('/');  // Redirect to home after logout
//     });
// });


router.get('/register', function (req, res, next) {
    res.render('register.ejs', {
        errors: [], // No errors initially
        shopData: { shopName: 'Aeroscope' }, // Replace with your actual shop data
        formData: {}, // Empty form data initially
    });
});
   

router.post(
    '/registered',
    [
        check('email').isEmail().withMessage('Please enter a valid email address'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
        check('first_name')
            .notEmpty()
            .withMessage('First name is required'),
        check('last_name')
            .notEmpty()
            .withMessage('Last name is required'),
        check('username')
            .notEmpty()
            .withMessage('Username is required'),
    ],
    function (req, res, next) {
        const errors = validationResult(req);

        // If validation errors exist, render the register page with errors
        if (!errors.isEmpty()) {
            return res.status(400).render('register', {
                errors: errors.array(),  // Pass errors array to the template
                shopData: { shopName: 'Your Shop Name' }, // Pass shop data
                formData: req.body,     // Pass form data to preserve user input
            });
        }

        // Proceed if validation passes
        const plainPassword = req.body.password;
        const username = req.body.username;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const email = req.body.email;

        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
            if (err) {
                return next(err);
            }

            let sqlquery =
                "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
            let newUser = [username, firstName, lastName, email, hashedPassword];

            db.query(sqlquery, newUser, (err, result) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(
                        `Hello ${firstName} ${lastName}, you are now registered with the username: ${username}.
                        We will send an email to you at ${email}`
                    );
                }
            });
        });
    }
);


//const { check, validationResult } = require('express-validator'); // Import express-validator

// router.post(
//     '/registered',
//     [
//         check('email').isEmail().withMessage('Please enter a valid email address'), // Email validation rule
//         check('password')
//             .isLength({ min: 8 })
//             .withMessage('Password must be at least 8 characters long')

//     ],
//     function (req, res, next) {
//         const errors = validationResult(req);

//         // If validation errors exist, redirect back to the registration page
//         if (!errors.isEmpty()) {
//             return res.redirect('./register');
//         }

//         // Proceed if validation passes
//         const plainPassword = req.body.password;
//         const username = req.body.username;
//         const firstName = req.body.first_name;
//         const lastName = req.body.last_name;
//         const email = req.body.email;

//         bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
//             if (err) {
//                 return next(err);
//             }

//             // SQL query to insert new user
//             let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";

//             // User data for insertion
//             let newUser = [username, firstName, lastName, email, hashedPassword];

//             // Execute SQL query
//             db.query(sqlquery, newUser, (err, result) => {
//                 if (err) {
//                     return next(err);
//                 } else {
//                     res.send(
//                         `Hello ${firstName} ${lastName}, you are now registered with the username: ${username}.
//                         We will send an email to you at ${email}`
//                     );
//                 }
//             });
//         });
//     }
// );






router.get('/listusers', function(req, res, next) {
    let sqlquery = "SELECT username, first_name, last_name, email FROM users" // query database to get user information
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("listusers.ejs", {userList:result})
     })
})



// Export the router object so index.js can access it
module.exports = router