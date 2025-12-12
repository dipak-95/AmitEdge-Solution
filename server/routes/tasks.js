const router = require('express').Router();
const taskController = require('../controllers/taskController');
const { verifyToken, checkRole } = require('../middleware/auth');

const upload = require('../middleware/upload');

router.post('/', verifyToken, checkRole(['superadmin', 'admin']), upload.array('attachments'), taskController.createTask);
router.get('/', verifyToken, taskController.getTasks);
router.get('/:id', verifyToken, taskController.getTaskById);
router.put('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, checkRole(['superadmin', 'admin']), taskController.deleteTask);

module.exports = router;
