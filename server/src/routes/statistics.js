const { Router } = require('express');
const { statisticsController } = require('../controllers/statisticsController');

const router = Router();

router.get('/summary', statisticsController.summary);
router.get('/by-category', statisticsController.byCategory);
router.get('/monthly-trend', statisticsController.monthlyTrend);

module.exports = router;
