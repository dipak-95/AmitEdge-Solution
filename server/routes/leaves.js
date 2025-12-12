const router = require('express').Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.post('/', verifyToken, leaveController.requestLeave);
router.get('/', verifyToken, leaveController.getLeaves);
router.put('/:id', verifyToken, checkRole(['superadmin']), leaveController.updateLeaveStatus);

module.exports = router;
