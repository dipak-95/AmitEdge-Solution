const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Get all users - Authenticated users (for dropdowns etc)
router.get('/', verifyToken, userController.getAllUsers);

// Create and Delete users - Superadmin only
router.post('/', verifyToken, checkRole(['superadmin']), userController.createUser);
router.delete('/:id', verifyToken, checkRole(['superadmin']), userController.deleteUser);

module.exports = router;
