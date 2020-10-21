import mongoose, { Schema } from 'mongoose';
import express from 'express';
var Router = express.Router();

const connect = (connectionString: string, cb: { (mongoose: typeof import('mongoose')): any }) => {
    mongoose.connect(connectionString, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, promiseLibrary: global.Promise }).then(mongoose => cb(mongoose));
}

const createModel = (name: string, ...fields: { name: string, options: { type: "Array" | "Boolean" | "Buffer" | "Date" | "Decimal128" | "DocumentArray" | "Embedded" | "Map" | "Mixed" | "Number" | "ObjectId" | "String" | Schema.Types.Array | Schema.Types.Boolean | Schema.Types.Buffer | Schema.Types.Date | Schema.Types.Decimal128 | Schema.Types.DocumentArray | Schema.Types.Embedded | Schema.Types.Map | Schema.Types.Mixed | Schema.Types.Number | Schema.Types.ObjectId | Schema.Types.String, required?: boolean, default?: any | Function, select?: boolean, validate?: Function, get?: Function, set?: Function, alias?: string, immutable?: boolean, transform?: Function, unique?: boolean }, public?: boolean }[]) => {
    const Schema = mongoose.Schema;

    var schemaObj = {};
    fields.forEach(field => {
        if (typeof field.options.type === "string") Object.defineProperty(field.options, "type", { value: Schema.Types[field.options.type] });
        Object.defineProperty(schemaObj, field.name, { value: field.options, enumerable: true });
    });

    var schema = new Schema(schemaObj);

    var privateFields = fields.filter(field => !field.public).map(field => field.name);

    var readOptions = {
        virtuals: true,
        transform: (doc: any, ret: any) => {
            delete ret._id;
            delete ret.__v;
            privateFields.forEach(field => delete ret[field]);
        }
    }

    schema.set('toJSON', readOptions);

    schema.set('toObject', readOptions);

    // TODO: remove private fields when reading
    schema

    return new Model(mongoose.model(name, schema), Router);
}

// const deleteUser = (idOrUsername, cb) => isValidID(idOrUsername) ? User.findByIdAndDelete(idOrUsername, (err, user) => cb(!err && !user ? "User with id \"" + idOrUsername + "\" does not exist" : err, user)) : User.findOneAndRemove({ username: idOrUsername }, (err, user) => cb(!err && !user ? "User with username \"" + idOrUsername + "\" does not exist" : err, user));

class Model {
    private endpoints: { method: "post" | "get" | "put" | "delete", relPath: string }[] = [];

    constructor(private mongoModel: mongoose.Model<mongoose.Document, {}>, private router: typeof Router) { }

    addEndpoint = (relPath: string, operation: "create" | "readById" | "readByField" | "readAll" | "updateById" | "updateByField" | "deleteById" | "deleteByField"): Model => {
        var method: "post" | "get" | "put" | "delete" = operation.slice(0, 4) === "create" ? "post" : operation.slice(0, 4) === "read" ? "get" : operation.slice(0, 6) === "update" ? "put" : "delete";
        if (this.endpoints.includes({ method, relPath })) throw "Endpoint already exists";
        if (operation.endsWith("Id") && !/^(?:\/[^:id])*\/:id(?:\/.*)*$/g.test(relPath)) throw "Id parameter doesn't exist";

        switch (operation) {
            case "create":
                this.router.post(relPath, (req, res, next) => {
                    this.mongoModel.create(req.body, (err: any, docs: mongoose.Document[]) => {
                        if (err) next(err);
                        else res.status(200).json(docs.length === 1 ? docs[0] : docs);
                    });
                });
                break;
            case "readById":
                this.router.get(relPath, (req, res, next) => {
                    this.mongoModel.findById(req.params.id, (err, doc) => {
                        if (err) next(err);
                        else res.status(200).json(doc);
                    });
                });
                break;
            case "readByField":
                this.router.get(relPath, (req, res, next) => {
                    this.mongoModel.find(req.body, (err, docs) => {
                        if (err) next(err);
                        else res.status(200).json(docs.length === 1 ? docs[0] : docs);
                    });
                });
                break;
            case "readAll":
                this.router.get(relPath, (req, res, next) => {
                    this.mongoModel.find((err, docs) => {
                        if (err) next(err);
                        else res.status(200).json(docs);
                    });
                });
                break;
            case "updateById":
                this.router.put(relPath, (req, res, next) => {
                    this.mongoModel.findByIdAndUpdate(req.params.id, req.body, (err, old) => {
                        if (err) next(err);
                        else res.status(200).send("Updated successfully");
                    });
                });
                break;
            case "updateByField":
                this.router.put(relPath, (req, res, next) => {
                    this.mongoModel.update(req.body.filter, req.body.fields, (err, raw) => {
                        if (err) next(err);
                        else res.status(200).send("Updated successfully");
                    });
                });
                break;
            case "deleteById":
                this.router.delete(relPath, (req, res, next) => {
                    this.mongoModel.findByIdAndDelete(req.params.id, (err, doc) => {
                        if (err) next(err);
                        else res.status(200).send("Deleted successfully");
                    });
                });
                break;
            case "deleteByField":
                this.router.delete(relPath, (req, res, next) => {
                    this.mongoModel.deleteMany(req.body, err => {
                        if (err) next(err);
                        else res.status(200).send("Deleted successfully");
                    });
                });
        }
        this.endpoints.push({ method, relPath });
        return this;
    }

    getRouter = () => this.router;
}

export { createModel, connect };

/* switch (operation) {
    case "create":
        method = "post";
        break;
    case "readAll" || "readByField" || "readById":
        method = "get";
        break;
    case "updateByField" || "updateById":
        method = "put";
        break;
    case "deleteByField" || "deleteById":
        method = "delete";
} */