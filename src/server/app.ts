const express = require('express');
const path = require('path');

const app = express();

app.use('/static', express.static('build/client'));

app.get('/', (req , res) => {
  res.sendFile('templates/index.html', { root: './' });
});

export default app;
