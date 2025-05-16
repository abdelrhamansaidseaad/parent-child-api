const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);
router.use(restrictTo('child'));

router.post('/link-parent', childController.linkToParent);

module.exports = router;