var express = require('express');
var path = require('path');

//var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
require('./models/setupMongo')();

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter=require('./routes/testapi')
var authRouter=require('./routes/auth');
var TodoRouter=require('./routes/Todo');
var GetitemsRouter=require('./routes/Getitems')
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', TodoRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testAPIRouter);
app.use('/auth', authRouter);
app.use('/Todo/', TodoRouter);

app.use('/Getitems',GetitemsRouter);
//app.use('/post', postRouter);
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;
