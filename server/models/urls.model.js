const mongoose = require('mongoose');
// const httpStatus = require('http-status');
// const APIError = require('../middlewares/APIError');

/**
 * Url Schema
 */
const UrlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  shortenedUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


/**
 * Statics
 */
UrlSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Url, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec();
  },

  getByShorId(shortId) {
    return this.findOne({ shortId });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Url[]>}
   */
  list({ skip = 0, limit = 100 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .lean() // no mongoose objects
      .exec();
  }
};

/**
 * @typedef Url
 */
module.exports = mongoose.model('Url', UrlSchema);
