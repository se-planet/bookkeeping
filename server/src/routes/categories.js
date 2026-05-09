const { Router } = require('express');
const { categoryController } = require('../controllers/categoryController');
const { validate } = require('../middleware/validateRequest');

const router = Router();

const categorySchema = {
  name: { required: true, type: 'string', maxLength: 30 },
  type: { required: true, oneOf: ['income', 'expense'] },
};

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', validate(categorySchema), categoryController.create);
router.put('/:id', validate(categorySchema), categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;
