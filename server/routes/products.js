import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// GET /api/products
// Query params: search, category, sort, page, limit
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 100 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { category:    { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    let query = Product.find(filter);

    if (sort === 'price-asc')  query = query.sort({ price: 1 });
    if (sort === 'price-desc') query = query.sort({ price: -1 });
    if (sort === 'rating')     query = query.sort({ rating: -1 });

    const skip = (Number(page) - 1) * Number(limit);
    query = query.skip(skip).limit(Number(limit));

    const [products, total] = await Promise.all([
      query.exec(),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/categories
router.get('/categories', async (_req, res) => {
  try {
    const cats = await Product.distinct('category');
    res.json(['All', ...cats.sort()]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { name, category, price, description, image, rating, reviews } = req.body;
    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ message: 'name, category, price, description and image are required.' });
    }
    const product = await Product.create({
      name, category, image, description,
      price:   Number(price),
      rating:  Number(rating)  || 0,
      reviews: Number(reviews) || 0,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, category, price, description, image, rating, reviews } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, image, description,
        price:   Number(price),
        rating:  Number(rating)  || 0,
        reviews: Number(reviews) || 0,
      },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
