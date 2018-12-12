const httpStatus = require('http-status');
const { check, validationResult } = require('express-validator/check');

const APIError = require('../helpers/APIError');
const models = require('../models');
const ImageModel = models.ImageModel;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storeImageToDirectory = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5//5MB
  },
  fileFilter: fileFilter
});

const saveImageDetails = (req, res, next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     let er= errors.mapped();
    //     let data = {};
    //     if(er.randomImage) {data.randomImage = er.randomImage.msg;}
    //     return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message:"Bad Request.", data });
    // } 

    let image = new ImageModel({
        contentType: req.file.mimetype,
        fileName: req.file.filename,
        encoding: req.file.encoding,
        destination: req.file.destination,
        size: req.file.size,
        path: req.file.path,
        data: null//bcz store in db now
    });
    image.randomImage = req.file.originalname;
    image.save().then(image => {
        return res.status(httpStatus.OK).json({
            randomImage: image.randomImage,
            fileName: image.fileName,
            encoding: image.encoding,
            destination: image.destination,
            size: image.size,
            path: image.path,
            contentType: image.contentType
        });
    })
    .catch(e => {
        console.log(e);
        const err = new APIError(e.message, e.status, true);
        next(err);
    });
};

module.exports = {
    storeImageToDirectory,
    saveImageDetails
};