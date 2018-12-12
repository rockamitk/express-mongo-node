const express= require('express');
const router = express.Router();

const imageRoute = require('./image.route');

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/v1/images', imageRoute);

module.exports = router;