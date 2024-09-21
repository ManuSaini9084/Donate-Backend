const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const apparelRoutes = require('./routes/apparelRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://donate-things-frontend.vercel.app/',
  optionsSuccessStatus: 200,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path, stat) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/apparel', apparelRoutes);
app.use('/api/blog', blogRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
