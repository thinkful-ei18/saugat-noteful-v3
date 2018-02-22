'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const { PORT, MONGODB_URI } = require('./config');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');


const notesRouter = require('./routes/notes');

const folderRouter = require('./routes/folders');

const tagRouter = require('./routes/tags');

const usersRouter = require('./routes/users');

const authRouter = require('./routes/auth');

// Create an Express application
const app = express();


// Log all requests. Skip logging during
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// Create a static webserver
app.use(express.static('public'));

// Parse request body
app.use(express.json());


passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/v3', usersRouter);
app.use('/v3', authRouter);

app.use(passport.authenticate('jwt', { session: false, failWithError: true }));

// Mount router on "/api"
app.use('/v3', notesRouter);
app.use('/v3', folderRouter);
app.use('/v3', tagRouter);

// Catch-all 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all Error handler
// Add NODE_ENV check to prevent stacktrace leak
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

if (require.main === module) {
  mongoose.connect(MONGODB_URI)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });

  // Listen for incoming connections
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;