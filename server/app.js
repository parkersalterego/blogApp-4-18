const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

require('dotenv').config();

// ENVIRONMENT
app.set('env', process.env.NODE_ENV || 'development');
app.set('host', process.env.HOST || '0.0.0.0');
app.set('port', process.env.PORT || 8080);

// routes
// const controllers = require('./controllers/controllers');

// logging
app.use(logger('common', {
    stream: fs.createWriteStream('./access.log', {
        flags: 'a'
    })
}));
app.use(logger('dev'));

// cors middleware
app.use(cors());

// body parser middleware
app.use(bodyParser());

// passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// require('./config/passport')(passport);

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// db connection
mongoose.connect(process.env.DATABASE);

mongoose.connection.on('connected', (req, res, next) => {
    console.log('Connected to Database ' + process.env.DATABASE_NAME);
});

mongoose.connection.on('error', (err, next) => {
    console.log('Error connecting to database ' + process.env.DATABASE_NAME +': ' + err);
});

// route-prefix
// app.use('/api', controllers);

// index orute
app.use('/', (req, res, next) => {
    res.send('please use /api/<desired-route>');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler - prints stack trace
if(app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.code || 500)
            .json({
                status : 'error',
                message  : err
            });
    });
}

// production error handler - no stack trace
if(app.get('env') === 'production') {
    app.use((err, req, res, next) => {
        res.status(err.code || 500)
            .json({
                status : 'error',
                message  : err.message
            });
    });
}

// start server
app.listen(app.get('port'), () => {
    console.log('REST API Listening on Port ' + app.get('port'));
});

module.exports = app;
