require('rootpath')();

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const router = express.Router();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

import { port, dbConnection, secret } from './config.json';

import { connect, createModel, errorHandler } from './modules/mongodb-handler.module';

connect(dbConnection, secret, mongoose => {
    var UserModel = createModel("User", {
        name: "username",
        options: { type: "String", required: true, unique: true },
        public: true
    }, {
        name: "password",
        options: { type: "String", required: true }
    });

    UserModel.addEndpoint('/', "create")
        .addEndpoint('/all', "readAll")
        .addEndpoint('/:id', "readById")
        .addEndpoint('/', "readByField")
        .addEndpoint('/:id', "updateById")
        .addEndpoint('/', "updateByField");

    app.use('/users', UserModel.getRouter());

    app.use(errorHandler);

    app.listen(port, () => {
        console.log('Server listening on port ' + port);
    });
});