const router = require('express').Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, attendanceController.checkInOrOut);
router.get('/', verifyToken, attendanceController.getAttendance);

module.exports = router;
