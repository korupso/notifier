require('rootpath')();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const { port } = require('./config.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

app.use('/', require('./endpoints'));

app.use(require('./middleware/error-handler'));

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});