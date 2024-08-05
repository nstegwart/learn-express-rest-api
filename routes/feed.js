const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const feedCoontroller = require('../controllers/feed');

router.get('/list', feedCoontroller.getPosts);
router.post('/create',[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], feedCoontroller.createPost);

module.exports = router;