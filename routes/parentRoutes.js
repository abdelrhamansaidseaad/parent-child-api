const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);
router.use(restrictTo('parent'));

router.post('/generate-code', parentController.generateLinkCode);
router.get('/children', parentController.getChildren);

module.exports = router;