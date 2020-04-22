const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')
const passport = require('passport')

const app = express();

//PASSPORT Config
require('./config/passport')(passport);
//DB Config
const db = require('./config/keys').MongoURI;

//Connect to DB
mongoose.connect(db,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BODYPARSER
app.use(express.urlencoded({ extended: false }));

//SESSION
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//FLASH
app.use(flash());

//Global variables
app.use((req, res, next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


//ROUTES
// https://www.website.com
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/experiments', require('./routes/experiments'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));