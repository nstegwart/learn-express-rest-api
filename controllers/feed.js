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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
  
    if(!req?.file) {
      const error = new Error('No image provided.');
      error.statusCode = 422;
      throw error;
    }
  
    const title = req.body.title;
    const content = req.body.content;
    const creator = req.body.creator;
    const image_url = req.file.path;
    const post = await Post.create({
      title: title,
      content: content,
      image_url: image_url,
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

exports.getPostDetail = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Post fetched.', post: post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    post.title = title;
    post.content = content;
    const result = await post.save();
    res.status(200).json({ message: 'Post updated!', post: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};