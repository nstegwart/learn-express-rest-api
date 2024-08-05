const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');

const port = process.env.PORT;

const app = express();

app.use(bodyParser.json()); // application/json

app.use('/feed', feedRoutes);

//Fixing CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${port}`);
  });
  