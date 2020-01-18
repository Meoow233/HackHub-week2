const express = require('express');
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const tweets = require('./tweets');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tingy:@Ace24680@hackhub-i1ofc.mongodb.net/test?retryWrites=true&w=majority');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./models/users');
const Tweets = require('./models/tweets');


//app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Application-level middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// add this line before logger to prevent logging all static file loading
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(session({
  secret: 'webdxd',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  Tweets.find({}, (err, tweets) => {
    res.locals.tweets = tweets;
    next();
  })
})

//passport middleware
passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser()); 

//app.get('/', (req, res) => res.send('Hello World!'));

  // app.get('/', (req, res) => {
  //   // find index.html using absolute path
  //   console.log("step in the get function");
  //   res.sendFile(path.join(__dirname, 'index.html'))
  // });

  app.locals.moment = require('moment');

  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  
  const index = require('./routes/index');
  const profile = require('./routes/profile');

  app.use('/', index);
  app.use('/profile', profile);

  // // catch 404 error and forward to error handler
app.use((req, res, next) => {
    const err =  new Error('Page Not Found');
    err.status = 404;
    next(err);
  });

app.use((err, req, res, next)=> {
    res.send(err.message);
  });