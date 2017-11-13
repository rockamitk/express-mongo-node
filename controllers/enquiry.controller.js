const Enquiry= require('../models/enquiry.model');

/**
 * Load enquiry and append to req.
 */
function load(req, res, next, id) {
  Enquiry.get(id)
    .then((enquiry) => {
      req.enquiry = enquiry; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}


/**
 * Get enquiry
 * @returns {Enquiry}
 */
function get(req, res) {
  return res.json(req.enquiry);
}

/**
 * Create new enquiry
 * @property {string} req.body.name - The name of enquiry.
 * @property {string} req.body.email - The email of enquiry.
 * @property {string} req.body.message - The message of enquiry.
 * @returns {Enquiry}
 */
function create(req, res, next) {
  const enquiry = new Enquiry({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  console.log(enquiry);
  enquiry.save()
    .then(savedEnquiry => res.json(savedEnquiry))
    .catch(e => next(e));
}
/**
 * Update existing enquiry
 * @property {string} req.body.name - The name of enquiry.
 * @property {string} req.body.email - The email of enquiry.
 * @returns {Enquiry}
 */
function update(req, res, next) {
  const enquiry = req.enquiry;
  enquiry.name = req.body.name;
  enquiry.email = req.body.email;
  enquiry.message = req.body.message;

  enquiry.save()
    .then(savedEnquiry => res.json(savedEnquiry))
    .catch(e => next(e));
}

/**
 * Get enquiry list.
 * @property {number} req.query.skip - Number of enquiries to be skipped.
 * @property {number} req.query.limit - Limit number of enquiries to be returned.
 * @returns {Enquiry[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Enquiry.list({ limit, skip })
    .then(enquiries => res.json(enquiries))
    .catch(e => next(e));
}

/**
 * Delete enquiry.
 * @returns {Enquiry}
 */
function remove(req, res, next) {
  const enquiry = req.enquiry;
  enquiry.remove()
    .then(deletedEnquiry => res.json(deletedEnquiry))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };