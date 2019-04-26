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
  title: {
    type: String,
    required: true
  },
  visit: {
    type: Number,
    default: 1
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
   * Get url
   * @param {ObjectId} id - id of url.
   * @returns {Promise<Url, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec();
  },

  /**
   * Get url
   * @param {ObjectId} shortId - shortId of url.
   * @returns {Promise<Url, APIError>}
   */
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
      .sort({ visit: -1 })
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
