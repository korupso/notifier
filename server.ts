require('rootpath')();

const bodyParser = require('body-parser');

const app = require('express')();

const { port } = require('./config.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('cors')({ origin: (origin, callback) => callback(null, true), credentials: true }));

app.use('/hello', require('express').Router().get('/world', (req, res) => res.send("Hello world!")));

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});