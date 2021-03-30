const express = require('express');
const cors = require('cors');
const mountRoutes = require('./routes');

const port = process.env.PORT || 8080;

const app = express();

app.use(
  cors({
    origin: '*',
    methods: 'GET, POST, PUT',
    allowedHeaders: '*',
    exposedHeaders: '*',
  }),
);
app.use(express.json());
app.use(express.static('./client/dist'));
mountRoutes(app);

app.listen(port, () => {
  console.log('Express server is listening on port', port);
});
