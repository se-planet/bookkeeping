const { Router } = require('express');
const { exportController } = require('../controllers/exportController');

const router = Router();

router.get('/csv', exportController.csv);
router.get('/excel', exportController.excel);

module.exports = router;
