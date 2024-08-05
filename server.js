const express = require('express');
const feedRoutes = require('./routes/feed');
const port = 3000;

const app = express();

app.use('/feed', feedRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  