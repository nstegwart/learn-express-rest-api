const { validationResult } = require('express-validator');
const mcache = require('memory-cache');

const Post = require('../models/post');

exports.createMassivePost = async (req, res, next) => {
  try {
    const dummyPosts = [];
    for (let i = 0; i < 1000; i++) {
      dummyPosts.push({
        title: `Dummy Post ${i + 1}`,
        content: `This is the content of dummy post number ${i + 1}`,
        image_url: 'https://example.com/dummy-image.jpg',
        creator: 'Dummy Creator',
      });
    }

    await Post.bulkCreate(dummyPosts);

    res.status(201).json({
      message: '1000 dummy posts created successfully!',
      count: dummyPosts.length,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  const key = `__express__getPosts_${req.query.page || 1}_${req.query.per_page || 10}`;
  const cachedBody = mcache.get(key);

  if (cachedBody) {
    return res.status(200).json(cachedBody);
  }

  try {
    // Ambil parameter page dan per_page dari query string
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const offset = (page - 1) * perPage;

    // Query database dengan paginasi
    const posts = await Post.findAll({
      offset: offset,
      limit: perPage,
    });

    // Hitung total jumlah posts
    const totalPosts = await Post.count();

    const responseBody = {
      message: 'Fetched posts successfully.',
      data: posts,
      pagination: {
        totalItems: totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / perPage),
        perPage: perPage,
      },
    };

    mcache.put(key, responseBody, 60 * 1000); // Cache for 1 minute

    res.status(200).json(responseBody);
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

    if (!req?.file) {
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
      created_at: new Date(),
    });
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
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
  const key = `__express__getPostDetail_${postId}`;
  const cachedBody = mcache.get(key);

  if (cachedBody) {
    return res.status(200).json(cachedBody);
  }

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }

    const responseBody = { message: 'Post fetched.', post: post };

    mcache.put(key, responseBody, 60 * 1000); // Cache for 1 minute

    res.status(200).json(responseBody);
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
