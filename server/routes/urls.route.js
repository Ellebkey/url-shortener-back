const express = require('express');
const urls = require('../controllers/urls.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(urls.create)
  .get(urls.list);

router.route('/:shortId')
  .put(urls.updateVisit)
  .get(urls.read);

router.route('/seed')
  .post(urls.bulkCreate);

router.param('shortId', urls.getByShorId);

module.exports = router;
