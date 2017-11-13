const express= require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const enquiryRoutes= require('./enquiry.route');
const authRoutes= require('./auth.route');
const config = require('../config/config');

const router = express.Router(); // eslint-disable-line new-cap

//enable JWT Token for each api 
/*router.use(function(req, res, next){
  let token = req.headers['token'] || req.body.token;
  if(token){
    jwt.verify(token, config.jwtSecret, function(err, decode){
      if(err){
        res.status(500).send("Invalid token");
      }else{
        next();
      }
    });
  }else{
    res.send("token has required as key in body or in headers");
  }
});
router.use(
  expressJwt({ secret: config.jwtSecret }).unless({
    path: [
      '/auth*'
    ]
  })
);
*/
/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount enqury routes at /enquiry
router.use('/enquiry', enquiryRoutes);
// router.use('/auth', authRoutes);

module.exports = router;