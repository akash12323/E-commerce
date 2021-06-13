if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}


const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
// const seedDB = require('./seed');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


//Routes
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/user');
const userProductRoutes = require('./routes/myProducts');



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended : true}));


app.use(session({
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

// Initilising the passport and sessions for storing the users info
app.use(passport.initialize());
app.use(passport.session());

// configuring the passport to use local strategy
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);
app.use(userRoutes);
app.use(userProductRoutes);



const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shoppingApp', 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
.then(()=>{
    console.log("DB Connected");
})
.catch(err=>{
    console.log(err);
})


// seedDB();


app.get('/',(req,res)=>{
    res.send("This is a root route");
    // res.render('products/index');
})

app.listen(3000,()=>{
    console.log("Server started on Port 3000");
})