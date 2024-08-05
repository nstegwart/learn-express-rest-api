const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json({
      message: 'Fetched posts successfully.',
      posts: posts
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array()
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  const creator = req.body.creator;
  try {
    const post = await Post.create({
      title: title,
      content: content,
      image_url: 'images/duck.jpg',
      creator: creator,
      created_at: new Date()
    });
    res.status(201).json({
      message: 'Post created successfully!',
      post: post
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
