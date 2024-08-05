const express = require('express');
const router = express.Router();
const feedCoontroller = require('../controllers/feed');

router.get('/list', feedCoontroller.getPosts);
router.post('/create', feedCoontroller.createPost);

module.exports = router;