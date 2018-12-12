const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Controllers = require('../controllers');

router.route('/store').post([
    // check('randomImage', 'Image has required.').exists(),
], Controllers.ImageController.storeImageToDirectory.single('randomImage'), 
Controllers.ImageController.saveImageDetails);

/*
router.route('/').get([
    check('', '.').exists(),
    check('', '.').exists()
], MController.method);
*/

module.exports = router;