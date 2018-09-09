let express = require('express');
let path = require('path');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let flash = require('connect-flash')
let session = require('express-session')
let { check, validationResult } = require('express-validator/check');
let passport = require('passport');
let config = require('./config/database')

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
})

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
let app = express();

// Bring in Models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
//app.set('views', path.join(__dirname, 'scripts'));
app.set('view engine', 'pug');

// Body Parser Middleware parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Home Route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else{
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});

// Route Files
let articles = require('./routes/article');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// Start Server
app.listen('3000', function(){
  console.log('Server started on port 3000...');
});
