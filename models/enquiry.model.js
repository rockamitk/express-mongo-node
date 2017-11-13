const Promise= require('bluebird');
const mongoose= require('mongoose');
const httpStatus= require('http-status');
const APIError= require('../helpers/APIError');

/**
 * Enquiry Schema
 */
const EnquirySchema = new mongoose.Schema({
  name: {type: String, required: true, minLength: 3, maxLength: 30},
  email: {type: String, required: true},
  message: {type: String, required: true, minLength: 3, maxLength: 1000},
  isSent: {type: Boolean, default: false },
  createdAt: {type: Date,default: Date.now}
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
EnquirySchema.method({
});

/**
 * Statics
 */
EnquirySchema.statics = {
  /**
   * Get enquiry
   * @param {ObjectId} id - The objectId of enquiry.
   * @returns {Promise<Enquiry, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((enquiry) => {
        if (enquiry) {
          return enquiry;
        }
        const err = new APIError('No such enquiry exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List enquiry in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of enquiry to be skipped.
   * @param {number} limit - Limit number of enquiry to be returned.
   * @returns {Promise<Enquiry[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Enquiry
 */
module.exports = mongoose.model('Enquiry', EnquirySchema);