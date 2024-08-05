const express = require('express');
const router = express.Router();
const feedCoontroller = require('../controllers/feed');

router.get('/posts', feedCoontroller.getPosts);

module.exports = router;