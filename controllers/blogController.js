const Blog = require('../models/Blog');

const getBlogPosts = async (req, res) => {
  try {
    const posts = await Blog.find();
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: 'Fetching blog posts failed' });
  }
};

const createBlogPost = async (req, res) => {
  const postData = new Blog(req.body);
  
  try {
    await postData.save();
    res.status(201).json({ message: 'Blog post created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Creating blog post failed' });
  }
};

module.exports = { getBlogPosts, createBlogPost };
