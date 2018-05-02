const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('express-jwt');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

require('dotenv').config();

const insecureRoutes = [
    '/',
    '/api/users/login',
    '/api/users/register'
]

// ENVIRONMENT
app.set('env', process.env.NODE_ENV || 'development');
app.set('host', process.env.HOST || '0.0.0.0');
app.set('port', process.env.PORT || 8080);

// routes
const controllers = require('./controllers/controllers');

// logging
app.use(logger('common', {
    stream: fs.createWriteStream('./access.log', {
        flags: 'a'
    })
}));
app.use(logger('dev'));

// parse application/json
app.use( bodyParser.json() );
app.use( cookieParser() );

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded({ extended: false }));

// CORS
// This allows client applications from other domains use the API Server
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

// JWT AUTH
app.use(jwt({secret: process.env.JWT_SECRET})
.unless({
    path: insecureRoutes
}));

app.use( async ( req, res, next ) => {
    if( req.method === 'OPTIONS' || isInsecurePage(req.path) ) {
        return next();
    } 
    try {
        const authHeader = req.get( 'Authorization' );
        const token = authHeader ? authHeader.split( ' ' )[ 1 ] : null;
        const tokenData = JSON.parse( atob( token.split( '.' )[ 1 ] ) );
        if ( !tokenData.id ) {
            throw new Error();
        }
        const user = await User.findById( tokenData.id );
        if ( !user || user.secStamp !== tokenData.secStamp ) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch( e ) {
        let err = new Error( 'Token Invalid' );
        err.name = 'UnauthorizedError';
        next( err );
    }
});

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
app.use('/api', controllers);

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

function isInsecurePage(loc) {
    for (let i = 0; i < insecureRoutes.length; i++) {
        if (loc.indexOf(insecureRoutes[i]) >= 0) {
            return true;
        }
    }
    return false;
}

module.exports = app;
