import { Router } from 'express';
import Review from '../models/Review.js';

const router = Router();

// GET /api/reviews
router.get('/', async (_req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews
router.post('/', async (req, res) => {
  try {
    const { name, rating, message } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({ message: 'name, rating and message are required.' });
    }

    if (message.trim().length < 20) {
      return res.status(400).json({ message: 'Message must be at least 20 characters.' });
    }

    // Build initials avatar
    const avatar = name
      .split(' ')
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);

    const review = await Review.create({
      name: name.trim(),
      avatar,
      role: 'Verified Buyer',
      rating: Number(rating),
      message: message.trim(),
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
