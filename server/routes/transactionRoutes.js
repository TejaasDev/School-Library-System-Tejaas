
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/issue', transactionController.issueBook);
router.post('/return', transactionController.returnBook);
router.get('/stats', transactionController.getStats);

module.exports = router;
