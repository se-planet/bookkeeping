const { Router } = require('express');
const { importController } = require('../controllers/importController');

const router = Router();

router.post('/csv', importController.importCSV);

module.exports = router;
