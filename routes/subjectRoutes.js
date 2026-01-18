const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

router.get('/list', subjectController.getSubjects);

module.exports = router;
