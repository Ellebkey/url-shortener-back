const express = require('express');
const urls = require('../controllers/urls.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(urls.create)
  .get(urls.list);

router.route('/:shortId')
  .get(urls.read);


router.param('shortId', urls.getByShorId);

module.exports = router;
