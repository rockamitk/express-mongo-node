const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../config/param-validation');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');

const router = express.Router();

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/token')
  .post(validate(paramValidation.genToken), authCtrl.generateToken);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

module.exports = router;
