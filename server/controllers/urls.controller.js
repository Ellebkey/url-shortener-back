const httpStatus = require('http-status');
const validUrl = require('valid-url');
const shortid = require('shortid');
const urlMetadata = require('url-metadata');
const Urls = require('../models/urls.model');
const logger = require('../../config/winston');
const APIError = require('../utils/APIError');
const seedUrls = require('../utils/seed-urls');

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

const createMethod = async (originalUrl, host, next) => {
  try {
    if (!validUrl.isUri(originalUrl)) return { valid: false };

    const metadata = await urlMetadata(originalUrl);
    const title = `${metadata.title.slice(0, 16)}...`;

    const shortId = shortid.generate();
    const shortenedUrl = `${host}/${shortId}`;

    const url = await Urls.create({
      originalUrl,
      shortId,
      shortenedUrl,
      title
    });
    return { url, valid: true };
  } catch (err) {
    logger.error(`Error creating url ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

/**
 * Create new url
 * @property {string} req.body.originalUrl - The url to be shortened.
 * @returns {Urls}
 */
controller.create = async (req, res, next) => {
  const { originalUrl, host } = req.body;
  try {
    const createdUrl = await createMethod(originalUrl, host, next);

    if (!createdUrl.valid) {
      logger.error('That is not a valid url');
      apiError.message = 'That is not a valid url';
      return next(apiError);
    }

    return res.json(createdUrl.url);
  } catch (err) {
    logger.error(`Error creating url ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

/**
 * Get url by shortId.
 * @property {number} id - Id of shortened url.
 * @returns {Urls}
 */
controller.getByShorId = async (req, res, next, id) => {
  try {
    const url = await Urls.getByShorId(id);
    logger.info(`getting url  ${id}`);

    if (!url) {
      apiError.status = httpStatus.NOT_FOUND;
      apiError.message = `Url with id: ${id}, was not found`;
      return next(apiError);
    }
    req.urlDB = url;
    return next();
  } catch (err) {
    logger.error(err);
    apiError.error = err;
    return next(apiError);
  }
};

/**
 * Get user
 * @returns {Urls}
 */
controller.read = (req, res) => res.json(req.urlDB);

/**
 * Create new url
 * @property {string} req.body.originalUrl - The url to be shortened.
 * @returns {Urls}
 */
controller.updateVisit = async (req, res, next) => {
  const { urlDB } = req;

  urlDB.visit += 1;

  try {
    const savedUrl = await urlDB.save();
    return res.json(savedUrl);
  } catch (err) {
    logger.error(`Error creating url ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};


controller.bulkCreate = async (req, res, next) => {
  const { host } = req.body;
  try {
    const promiseUrls = [];
    seedUrls.forEach((item) => {
      promiseUrls.push(createMethod(item.originalUrl, host, next));
    });
    await Promise.all(promiseUrls);
    return res.json({ res: 'success' });
  } catch (err) {
    logger.error(`Error creating url ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

module.exports = controller;
