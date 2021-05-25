const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');



router.get('/register',(req,res)=>{
    res.render('auth/register');
})

router.post('/register',async(req,res)=>{
    try{
        const user = new User({email:req.body.email, username:req.body.username});
        const newUser = await User.register(user,req.body.password);
        req.flash('success','Registered successfully')
        res.redirect('/products');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
})

router.get('/login',(req,res)=>{
    res.render('auth/login');
})

router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }
    ), (req, res) => {
        req.flash('success', `Welcome Back!! ${req.user.username}`)
        res.redirect('/products');
});


// Logout the user from the current session
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out Successfully');
    res.redirect('/login');
})


module.exports = router;

