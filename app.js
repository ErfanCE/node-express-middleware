const express = require('express');
const morgan = require('morgan');

const productRouter = require('./routes/product-route');

const app = express();
const host = '127.0.0.1';
const port = 8000;

// Logger
app.use(morgan('dev'));

// request body parser
app.use(express.json());

//* Root Route
app.get('/', (_request, response) => {
  response.status(200).json({
    status: 'success',
    data: { message: 'Root Route' }
  });
});

//* Routing
app.use('/product', productRouter);

//* Unhandled Routes(404)
app.all('*', (request, response) => {
  response.status(404).json({
    status: 'fail',
    data: { message: 'Not Found' }
  });
});

app.listen(port, host, () => {
  console.info(`[i] Listening on ${host}:${port}...`);
});
