const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/list', feedController.getPosts);
router.post('/create', [
    body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
    body('content').trim().isLength({ min: 5 }).withMessage('Content must be at least 5 characters long'),
    body('image_url').isURL().withMessage('Image URL must be a valid URL'),
    body('creator').trim().notEmpty().withMessage('Creator is required')
], feedController.createPost);
module.exports = router;