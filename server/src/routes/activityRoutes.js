const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/activityController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { activityQuerySchema } = require('../validators/activityValidator');

router.use(authenticate);
router.get('/', authorize('admin', 'manager'), validate(activityQuerySchema, 'query'), getLogs);

module.exports = router;
