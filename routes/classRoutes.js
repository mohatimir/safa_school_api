const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/list.php', classController.getClasses); // Maintaining .php extension for compatibility if easiest, but better remove it
// Actually, let's keep clean routes and I will update the Flutter app.
router.get('/list', classController.getClasses);

module.exports = router;
