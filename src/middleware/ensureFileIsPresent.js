/**
 * Ensures that a file is present in the request.
 * If the file is not present, a 422 status code is returned with a message indicating that the file is required.
 * If the file is present, the next middleware function is called.
 * @function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {function} next - The next middleware function
 */
module.exports = (req, res, next) => {
    if (!req.file) {
      res.status(422).json({ message: 'The file is required.' });
    } else {
      next();
    }
  }