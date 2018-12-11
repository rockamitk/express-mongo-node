const express= require('express');
const router = express.Router();

const config = require('../config');
// const tabRoute = require('./tab.route');

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// router.use('/v1/tab', tabRoute);

module.exports = router;