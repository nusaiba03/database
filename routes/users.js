// Create a new router
const express = require("express")
const bcrypt = require('bcrypt')
const router = express.Router()
const saltRounds = 10

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
      
    // saving data in database
    //res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered with the username: ' + username +  'We will send an email to you at ' + email + '.')                                                                           
})

// Export the router object so index.js can access it
module.exports = router