const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Apparel = require('../models/Apparel');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for storing uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter for allowed image types (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extName && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images are allowed!'), false);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

// Submit apparel with image upload
const submitApparel = async (req, res) => {
  const apparelData = new Apparel({
    ...req.body,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
  });

  try {
    await apparelData.save();
    res.status(201).json({
      message: 'Apparel submitted successfully',
      apparel: apparelData
    });
  } catch (error) {
    res.status(400).json({ error: 'Submission failed', details: error.message });
  }
};

// Get apparels with populated user data
const getApparels = async (req, res) => {
  try {
    const apparels = await Apparel.find().populate('userId', 'username email');
    res.json(apparels);
  } catch (error) {
    res.status(400).json({ error: 'Fetching apparels failed' });
  }
};

// Delete apparel by ID
const deleteApparel = async (req, res) => {
  try {
    const { id } = req.params;
    await Apparel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Apparel deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Deletion failed' });
  }
};

module.exports = {
  submitApparel: [upload.single('image'), submitApparel],
  getApparels,
  deleteApparel
};
