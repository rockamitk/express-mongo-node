const express= require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const enquiryRoutes= require('./enquiry.route');
const authRoutes= require('./auth.route');
const config = require('../config/config');

const router = express.Router(); // eslint-disable-line new-cap


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount enqury routes at /enquiry
router.use('/enquiry', enquiryRoutes);
// router.use('/auth', authRoutes);

module.exports = router;