// //Importing required modules
// const express = require('express');
// const bcrypt = require('bcrypt');
// const router = express.Router();
// const saltRounds = 10;
// const { check, validationResult } = require('express-validator');

// // Middleware to check if the user is logged in
// const redirectLogin = (req, res, next) => {
//     if (!req.session.userId) {
//         res.redirect('/login');
//     } else {
//         next(); 
//     }
// };

// // Middleware to check if the user has admin role
// const redirectAdmin = (req, res, next) => {
//     if (req.session.user && req.session.user.role === 'admin') {
//         next();
//     } else {
//         res.status(403).send('Access Denied');
//     }
// };



// // Route to render login page
// router.get('/login', (req, res, next) => {
//     res.render('login'); 
// });

// // Route to handle login credentials
// router.post('/loggedin', (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const username = req.body.username;
//     const plainPassword = req.body.password;

//     // Query the database to get the user's hashed password
//     let sqlquery = "SELECT hashedPassword, role FROM users WHERE username = ?";
//     db.query(sqlquery, [username], (err, result) => {
//         if (err) {
//             return next(err);
//         }

//         if (result.length === 0) {
//             return res.send('Username not found.');
//         }

//         const hashedPassword = result[0].hashedPassword;
//         const userRole = result[0].role;

//         // Compare the supplied password with the stored hashed password
//         bcrypt.compare(plainPassword, hashedPassword, (err, match) => {
//             if (err) {
//                 return next(err);
//             }

//             if (match) {
//                 // If password match, create session
//                 req.session.userId = req.body.username;
//                 // Redirect to home page after successful login
//                 return res.redirect('/');
//             } else {
//                 // If passwords don't match
//                 res.send('Incorrect password.');
//             }
//         });
//     });
// });

// // Route to render register page
// router.get('/register', (req, res, next) => {
//     res.render('register.ejs', {
//         errors: [],
//         formData: {} 
//     });
// });

// // Route to handle new user registration
// router.post(
//     '/registered',
//     [
//         check('email').isEmail().withMessage('Please enter a valid email address'),
//         check('password')
//             .isLength({ min: 8 })
//             .withMessage('Password must be at least 8 characters long'),
//         check('first_name')
//             .notEmpty()
//             .withMessage('First name is required'),
//         check('last_name')
//             .notEmpty()
//             .withMessage('Last name is required'),
//         check('username')
//             .notEmpty()
//             .withMessage('Username is required'),
//     ],
//     (req, res, next) => {
//         const errors = validationResult(req);

//         // If validation errors exist, render the register page with errors
//         if (!errors.isEmpty()) {
//             return res.status(400).render('register', {
//                 errors: errors.array(),
//                 formData: req.body, 
//             });
//         }

//         // Proceed if validation passes
//         const plainPassword = req.body.password;
//         const username = req.body.username;
//         const firstName = req.body.first_name;
//         const lastName = req.body.last_name;
//         const email = req.body.email;

//         // Hash password before storing it in database 
//         bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
//             if (err) {
//                 return next(err);
//             }

//             //Insert new user data into database
//             let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
//             let newUser = [username, firstName, lastName, email, hashedPassword];

//             db.query(sqlquery, newUser, (err, result) => {
//                 if (err) {
//                     return next(err);
//                 } else {
//                     res.send(`Hello ${firstName} ${lastName}, you are now registered with the username: ${username}`);
//                 }
//             });
//         });
//     }
// );

// // Route to render logout page
// router.get('/logout', redirectLogin, (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             console.error('Error destroying session:', err);
//             return res.redirect('/');  // Redirect if there's an error
//         }
//         res.render('logout', {message: "You've successfully logged out"});  // Redirect to home after logout
//     });
// });

// // List all users (admin-only route)
// router.get('/listusers', (req, res, next) => {
//     let sqlquery = "SELECT username, first_name, last_name, email, role FROM users"; // Query database for user information
//     db.query(sqlquery, (err, result) => {
//         if (err) {
//             return next(err);
//         }
//         res.render("listusers.ejs", { userList: result });
//     });
// });

// // Export the router object to be used in other parts of the application
// module.exports = router;
// module.exports.redirectLogin = redirectLogin; // Export the redirectLogin middleware separately






//Importing required modules
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 10;
const { check, validationResult } = require('express-validator');

// Middleware to check if the user is logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next(); 
    }
};

// Middleware to check if the user has admin role
const redirectAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access Denied');
    }
};



// Route to render login page
router.get('/login', (req, res, next) => {
    res.render('login'); 
});

// Route to handle login credentials
router.post('/loggedin', (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const username = req.body.username;
    const plainPassword = req.body.password;

    // Query the database to get the user's hashed password
    let sqlquery = "SELECT hashedPassword, role FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            return next(err);
        }

        if (result.length === 0) {
            return res.send('Username not found.');
        }

        const hashedPassword = result[0].hashedPassword;
        const userRole = result[0].role;

        // Compare the supplied password with the stored hashed password
        bcrypt.compare(plainPassword, hashedPassword, (err, match) => {
            if (err) {
                return next(err);
            }

            if (match) {
                // If password match, create session
                req.session.userId = username;
                req.session.user = { username: username, role: userRole };
                // Redirect to home page after successful login
                return res.redirect('/');
            } else {
                // If passwords don't match
                res.send('Incorrect password.');
            }
        });
    });
});

// Route to render register page
router.get('/register', (req, res, next) => {
    res.render('register.ejs', {
        errors: [],
        formData: {} 
    });
});

// Route to handle new user registration
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
    (req, res, next) => {
        const errors = validationResult(req);

        // If validation errors exist, render the register page with errors
        if (!errors.isEmpty()) {
            return res.status(400).render('register', {
                errors: errors.array(),
                formData: req.body, 
            });
        }

        // Proceed if validation passes
        const plainPassword = req.body.password;
        const username = req.body.username;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const email = req.body.email;
        const role = req.body.role || 'user';

        // Hash password before storing it in database 
        bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
            if (err) {
                return next(err);
            }

            //Insert new user data into database
            let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword, role) VALUES (?,?,?,?,?,?)";
            let newUser = [username, firstName, lastName, email, hashedPassword, 'user'];

            db.query(sqlquery, newUser, (err, result) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(`Hello ${firstName} ${lastName}, you are now registered with the username: ${username}`);
                }
            });
        });
    }
);

// Route to render logout page
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/');  // Redirect if there's an error
        }
        res.render('logout', {message: "You've successfully logged out"});  // Redirect to home after logout
    });
});

// List all users (admin-only route)
router.get('/listusers', redirectAdmin, (req, res, next) => {
    let sqlquery = "SELECT username, first_name, last_name, email, role FROM users"; // Query database for user information
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("listusers.ejs", { userList: result });
    });
});

// Export the router object to be used in other parts of the application
module.exports = router;
module.exports.redirectLogin = redirectLogin; // Export the redirectLogin middleware separately
