const router = require('express').Router();
const reportController = require('../controllers/reportController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/', verifyToken, reportController.getReports);

module.exports = router;
