const { Router } = require('express');
const { transactionController } = require('../controllers/transactionController');
const { validate } = require('../middleware/validateRequest');

const router = Router();

const transactionSchema = {
  type: { required: true, oneOf: ['income', 'expense'] },
  amount: { required: true, type: 'number', min: 0.01 },
  category_id: { required: true, type: 'number' },
  date: { required: true, type: 'string' },
  note: { type: 'string', maxLength: 200 },
};

router.get('/', transactionController.getAll);
router.get('/:id', transactionController.getById);
router.post('/', validate(transactionSchema), transactionController.create);
router.put('/:id', validate(transactionSchema), transactionController.update);
router.delete('/:id', transactionController.remove);

module.exports = router;
