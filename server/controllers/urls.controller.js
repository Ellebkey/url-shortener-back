const httpStatus = require('http-status');
const Urls = require('../models/urls.model');
const logger = require('../../config/winston');
const APIError = require('../utils/APIError');

const apiError = new APIError({
  message: 'An unexpected error occurred',
  status: httpStatus.INTERNAL_SERVER_ERROR,
  stack: undefined,
});

const controller = {};

/**
 * Get urls list.
 * @property {number} req.query.skip - Number of urls to be skipped.
 * @property {number} req.query.limit - Limit number of urls to be returned.
 * @returns {Urls[]}
 */
controller.list = async (req, res, next) => {
  const { limit = 100, skip = 0 } = req.query;

  try {
    const urls = await Urls.list({ limit, skip });
    logger.info('getting urls list');
    return res.json(urls);
  } catch (err) {
    logger.error(`Error in getting urls ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

module.exports = controller;
