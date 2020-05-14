const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//var sassMiddleware = require('node-sass-middleware');

const oversigtRouter = require('./routes/oversigt');
const opgaverRouter = require('./routes/opgaver');
const indexRouter = require('./routes/index');
const oversigt_opgaverRouter = require('./routes/oversigt_opgaver');
const laerer_oversigtRouter = require('./routes/laerer_oversigt');
const hjaelpemidlerRouter = require('./routes/hjaelpemidler');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/*app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
})); */

//Gets Css and images
app.use(express.static(path.join(__dirname, 'public')));

app.use('/oversigt', oversigtRouter);
app.use('/opgaver', opgaverRouter);
app.use('/index', indexRouter);
app.use('/oversigt_opgaver', oversigt_opgaverRouter);
app.use('/laerer_oversigt', laerer_oversigtRouter)
app.use('/hjaelpemidler', hjaelpemidlerRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});







module.exports = {
  app:app,
};

