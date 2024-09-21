const express = require('express');
const { submitApparel, getApparels, deleteApparel } = require('../controllers/apparelController');
const router = express.Router();

router.post('/submit', submitApparel);
router.get('/', getApparels);
router.delete('/:id', deleteApparel); // Add delete route

module.exports = router;
