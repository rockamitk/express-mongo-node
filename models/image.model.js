const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');

const ImageSchema = new Schema({
    randomImage:String,
    fileName: String,
    encoding: String,
    contentType: String,
    destination: String,
    size: Number,
    path: String,
    data: Buffer 
}, {timestamps: true});

/**
 * Statics
 */
ImageSchema.statics = {
    get(id) {
        return this.findById(id)
            .then((object) => {
                if (object) {return object;}
                const err = new APIError("Image does not exist.", httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },
    select(query, fields) {
        return this.find(query).select(fields).then(data => data);
    }
};

module.exports = mongoose.model('Image', ImageSchema);