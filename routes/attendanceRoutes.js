const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/take', attendanceController.takeAttendance);
router.get('/list', attendanceController.getAttendance);

module.exports = router;
