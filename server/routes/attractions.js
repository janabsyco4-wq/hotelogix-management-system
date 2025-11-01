const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all attractions
router.get('/', async (req, res) => {
  try {
    const attractions = await prisma.attraction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(attractions);
  } catch (error) {
    console.error('Error fetching attractions:', error);
    res.status(500).json({ error: 'Failed to fetch attractions' });
  }
});

// Get attraction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const attraction = await prisma.attraction.findUnique({
      where: { id: parseInt(id) }
    });

    if (!attraction) {
      return res.status(404).json({ error: 'Attraction not found' });
    }

    res.json(attraction);
  } catch (error) {
    console.error('Error fetching attraction:', error);
    res.status(500).json({ error: 'Failed to fetch attraction' });
  }
});

// Create new attraction (admin only - simplified for demo)
router.post('/', async (req, res) => {
  try {
    const { title, subtitle, description, image, location } = req.body;

    const attraction = await prisma.attraction.create({
      data: {
        title,
        subtitle,
        description,
        image,
        location
      }
    });

    res.status(201).json(attraction);
  } catch (error) {
    console.error('Error creating attraction:', error);
    res.status(500).json({ error: 'Failed to create attraction' });
  }
});

module.exports = router;