const express = require('express');
const { getBlogPosts, createBlogPost } = require('../controllers/blogController');
const router = express.Router();

router.get('/', getBlogPosts);
router.post('/create', createBlogPost);

module.exports = router;
