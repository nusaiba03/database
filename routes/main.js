// //Importing required modules
// const express = require("express")
// const router = express.Router()
// const axios = require('axios');

// // Middleware to check role permissions
// const checkRole = (roles) => {
//     return (req, res, next) => {
//         if (!req.session.user || !roles.includes(req.session.user.role)) {
//             return res.status(403).send("Access Denied");
//         }
//         next();
//     };
// };

// // Route to render index/home page
// router.get('/',function(req, res, next){
//     res.render('index')
// })

// // Route to render about page
// router.get('/about',function(req, res, next){
//     res.render('about')
// })

// // Route to fetch and display weather info using API
// router.get('/weather', async (req, res, next) => {
//     const apiKey = 'a4c83f76a69738d66ac314f1eb635233'; // Replace with your actual API key
//     const city = req.query.city || 'London'; // Default city is Manchester
//     const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

//     try {
//         //Make request to OpenWeather API to get data
//         const response = await axios.get(url);
//         const weatherData = response.data;

//         // Create a human-readable weather message
//         const weatherMessage = `
//             <h1>Weather in ${weatherData.name}</h1>
//             <p>It is ${weatherData.main.temp}°C.</p>
//             <p>The humidity is ${weatherData.main.humidity}%.</p>
//             <p>The wind speed is ${weatherData.wind.speed} m/s.</p>
//             <p>Weather condition: ${weatherData.weather[0].description}.</p>
//         `;

//         // Serve either HTML and EJS view
//         if (req.query.format === 'html') {
//             res.send(weatherMessage);
//         } else {
//             res.render('weather.ejs', {
//                 weather: weatherData,
//                 city: city,
//                 error: null, 
//             });
//         }
//     } catch (error) {
//         // Handle input errors 
//         let errorMsg;
//         if (error.response && error.response.status === 404) {
//             errorMsg = `City "${city}" not found. Please try a valid city name.`;
//         } else {
//             errorMsg = `An error occurred while fetching weather data. Please try again later.`;
//         }

//         // Serve error message in HTML or EJS
//         if (req.query.format === 'html') {
//             res.send(`<p style="color:red;">${errorMsg}</p>`);
//         } else {
//             res.render('weather.ejs', {
//                 error: errorMsg,
//                 weather: null, // No weather data
//                 city: city,
//             });
//         }
//     }
// });

// // Export the router object so index.js can access it
// module.exports = router



//Importing required modules
const express = require("express")
const router = express.Router()
const axios = require('axios');

// Middleware to check role permissions 
const checkRole = (roles) => { 
    return (req, res, next) => { 
        if (!req.session.user || !roles.includes(req.session.user.role)) { 
            return res.status(403).send("Access Denied"); 
        } next(); 
    }
}

// Route to render index/home page
router.get('/',function(req, res, next){
    res.render('index')
})

// Route to render about page
router.get('/about',function(req, res, next){
    res.render('about')
})

// Route to render add flights page (admin-only)
router.get('/addflight', (req, res, next) => {
    res.render('addflight');
});

// Route to render list users page (admin-only)
router.get('/listusers', checkRole(['admin']), (req, res, next) => {
    let sqlquery = "SELECT username, first_name, last_name, email, role FROM users"; // Query database for user information
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("listusers.ejs", { userList: result });
    });
});

// Route to fetch and display weather info using API
router.get('/weather', async (req, res, next) => {
    const apiKey = 'a4c83f76a69738d66ac314f1eb635233'; // Replace with your actual API key
    const city = req.query.city || 'London'; // Default city is Manchester
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        //Make request to OpenWeather API to get data
        const response = await axios.get(url);
        const weatherData = response.data;

        // Create a human-readable weather message
        const weatherMessage = `
            <h1>Weather in ${weatherData.name}</h1>
            <p>It is ${weatherData.main.temp}°C.</p>
            <p>The humidity is ${weatherData.main.humidity}%.</p>
            <p>The wind speed is ${weatherData.wind.speed} m/s.</p>
            <p>Weather condition: ${weatherData.weather[0].description}.</p>
        `;

        // Serve either HTML and EJS view
        if (req.query.format === 'html') {
            res.send(weatherMessage);
        } else {
            res.render('weather.ejs', {
                weather: weatherData,
                city: city,
                error: null, 
            });
        }
    } catch (error) {
        // Handle input errors 
        let errorMsg;
        if (error.response && error.response.status === 404) {
            errorMsg = `City "${city}" not found. Please try a valid city name.`;
        } else {
            errorMsg = `An error occurred while fetching weather data. Please try again later.`;
        }

        // Serve error message in HTML or EJS
        if (req.query.format === 'html') {
            res.send(`<p style="color:red;">${errorMsg}</p>`);
        } else {
            res.render('weather.ejs', {
                error: errorMsg,
                weather: null, 
                city: city,
            })
        }
    }
})

module.exports = router;
