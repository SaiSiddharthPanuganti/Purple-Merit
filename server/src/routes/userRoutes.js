const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  querySchema,
} = require('../validators/userValidator');

// All routes require authentication
router.use(authenticate);

// Profile routes (any authenticated user)
router.get('/me', userController.getProfile);
router.put('/me', validate(updateProfileSchema), userController.updateProfile);

// Stats (admin, manager)
router.get('/stats', authorize('admin', 'manager'), userController.getUserStats);

// User CRUD
router.get('/', authorize('admin', 'manager'), validate(querySchema, 'query'), userController.getUsers);
router.post('/', authorize('admin'), validate(createUserSchema), userController.createUser);
router.get('/:id', authorize('admin', 'manager'), userController.getUserById);
router.put('/:id', authorize('admin', 'manager'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
