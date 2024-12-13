//Importing required modules
const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator");

// Import the redirectLogin and checkRole middleware
const { redirectLogin } = require("./users");
// const checkRole = require("./main");


// Route to render search page
router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

// Route to handle search results
router.get('/search_result', redirectLogin,function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM flights WHERE name LIKE '%" + req.query.search_text + "%'" // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableFlights:result})
     }) 
})

// Route to display list of all flights
router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM flights" 
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableFlights:result})
     })
})

// Route to render add flight page (admin-only) 
router.get('/addflight', (req, res, next) => { 
    res.render('addflight.ejs', { 
        formData: {}, 
        errors: [] 
    })
})

 // Route to handle submission of new flights
router.post(
    '/flightadded',
    [
        check('name')
            .notEmpty()
            .withMessage('Flight name is required.')
            .isLength({ max: 100 })
            .withMessage('Flight name cannot exceed 100 characters.')
            .escape(), // Sanitize input
        check('price')
            .notEmpty()
            .withMessage('Price is required')
            .isFloat({ gt: 0 })
            .withMessage('Price must be a positive number.'),
    ],
    (req, res, next) => {
        //Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('addflight.ejs', {
                errors: errors.array(),
                formData: req.body,
            });
        }

        // If validation passes, inserting flight data into database
        let sqlquery = "INSERT INTO flights (name, price) VALUES (?, ?)";
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err);
            } else {
                res.send(
                    `This flight is added to the database, name: ${req.body.name}, price: ${req.body.price}`
                );
            }
        });
    }
);

//Route to display bargain flights (<£200)
router.get('/bargainflights', function(req, res, next) {
    let sqlquery = "SELECT * FROM flights WHERE price < 200"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargains.ejs", {availableFlights:result})
    })
}) 


// Export the router object so index.js can access it
module.exports = router


