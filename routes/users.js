// Create a new router
const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const saltRounds = 10


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
    res.render('register.ejs')                                                               
})    

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password
    const username = req.body.username 
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const email = req.body.email

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
        if (err) {
            return next(err);
        }
        //saving data in database
        let sqlquery = "INSERT INTO users (username,first_name,last_name,email,hashedPassword) VALUES (?,?,?,?,?) "

        //execute sql query
        let newUser = [username,firstName,lastName,email,hashedPassword]
        db.query(sqlquery, newUser, (err,result) => {
            if (err) {
                next(err)
            }
            else
            res.send(' Hello '+ firstName + ' '+ lastName +' you are now registered with the username: ' + username +  'We will send an email to you at ' + req.body.email) 
        })
      })
      
    })


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