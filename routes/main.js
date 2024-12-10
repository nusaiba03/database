// Create a new router
const express = require("express")
const router = express.Router()
const axios = require('axios');

// const redirectLogin = (req, res, next) => {
//     if (!req.session.userId ) {
//       res.redirect('/users/login') // redirect to the login page
//     } else { 
//         next (); // move to the next middleware function
//     } 
// }
// module.exports = {redirectLogin};


// Handle our routes
router.get('/',function(req, res, next){
    res.render('index')
})

router.get('/about',function(req, res, next){
    res.render('about')
})

router.get('/weather', async (req, res, next) => {
    const apiKey = 'a4c83f76a69738d66ac314f1eb635233'; // Replace with your actual API key
    const city = req.query.city || 'manchester'; // Default city is Manchester
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        // Create a human-readable weather message
        const weatherMessage = `
            <h1>Weather in ${weatherData.name}</h1>
            <p>It is ${weatherData.main.temp} degrees Celsius.</p>
            <p>The humidity is ${weatherData.main.humidity}%.</p>
            <p>The wind speed is ${weatherData.wind.speed} m/s.</p>
            <p>Weather condition: ${weatherData.weather[0].description}.</p>
        `;

        // Serve both HTML and EJS rendering
        if (req.query.format === 'html') {
            res.send(weatherMessage); // Respond with human-readable HTML
        } else {
            res.render('weather.ejs', {
                weather: weatherData,
                city: city,
            }); // Render with EJS template
        }
    } catch (error) {
        // Handle API or input errors gracefully
        if (error.response && error.response.status === 404) {
            const errorMsg = `City "${city}" not found. Please try a valid city name.`;

            // Serve error message in HTML or EJS
            if (req.query.format === 'html') {
                res.send(`<p style="color:red;">${errorMsg}</p>`);
            } else {
                res.render('weather.ejs', {
                    error: errorMsg,
                    weather: null,
                    city: city,
                });
            }
        } else {
            next(error); // For other errors, pass to the global error handler
        }
    }
});



// router.get('/logout', redirectLogin, (req,res) => {
//     req.session.destroy(err => {
//     if (err) {
//       return res.redirect('/')
//     }
//     res.render('logout','you are now logged out. <a href='+'./'+'>Home</a>');
//     })
// })


// Export the router object so index.js can access it
module.exports = router