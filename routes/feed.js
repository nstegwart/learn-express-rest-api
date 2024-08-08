const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/list', feedController.getPosts);

//Validate data before creating a post
router.post(
  '/create',
  [
    body('title')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Title must be at least 5 characters long'),
    body('content')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Content must be at least 5 characters long'),
    body('image_url').trim().isString().withMessage('Image URL is required'),
    body('creator').trim().notEmpty().withMessage('Creator is required'),
  ],
  feedController.createPost
);

router.get('/:postId', feedController.getPostDetail);

module.exports = router;
