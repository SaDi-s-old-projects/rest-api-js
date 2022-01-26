const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
require('express-async-errors');

// Some modules
const { handlerInternalServerError } = require('./middlewares/handlerInternalServerError');

// Verifying configs
if (!config.get('jwtPrivateKey')) {
  console.log('"privateKey" environment variable is required');
  process.exit(1);
}

// Import routes
const rootRouter = require('./routes/root');
const categoriesRouter = require('./routes/categories');
const customersRouter = require('./routes/customers');
const coursesRouter = require('./routes/courses');
const enrollmentsRouter = require('./routes/enrollments');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// Constants
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', rootRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/customers', customersRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.use(handlerInternalServerError);

mongoose.connect('mongodb://localhost/rest-api', () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server has been started on ${PORT} port`));
})