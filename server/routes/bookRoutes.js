
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.post('/', bookController.addBook);
router.post('/bulk', bookController.bulkUpload);

module.exports = router;
