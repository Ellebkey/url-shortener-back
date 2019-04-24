const express = require('express');
const urls = require('../controllers/urls.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(urls.list);

module.exports = router;
