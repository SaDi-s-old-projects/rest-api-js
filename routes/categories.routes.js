const { Router } = require('express');
const { Types: { ObjectId: { isValid } } } = require('mongoose');
const { Category, validateCategory } = require('../models/category.model');
const { auth } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/isAdmin.middleware');
const router = Router();

router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
})

router.get('/:id', async (req, res) => {
  if (!isValid(req.params.id)) return res.status(404).send('Yaroqsiz id');
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).send('Kategoriya topilmadi');
  res.send(category);
})

router.post('/', auth, async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newCategory = new Category({
    name: req.body.name
  });

  newCategory = await newCategory.save();
  res.send(newCategory);
})

router.put('/:id', auth, async (req, res) => {
  if (!isValid(req.params.id)) return res.status(404).send('Yaroqsiz id');
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

  if (!category) return res.status(404).send('Kategoriya topilmadi');

  res.send(category);
})

router.delete('/:id', [auth, isAdmin], async (req, res) => {
  if (!isValid(req.params.id)) return res.status(404).send('Yaroqsiz id');
  let category = await Category.findByIdAndRemove(req.params.id);
  if (!category) return res.status(404).send('Kategoriya topilmadi');
  res.send(category);
})

module.exports = router;