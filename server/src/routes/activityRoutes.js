const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/activityController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.use(authenticate);
router.get('/', authorize('admin', 'manager'), getLogs);

module.exports = router;
