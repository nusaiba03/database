// Create a new router
const express = require("express")
const router = express.Router()

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