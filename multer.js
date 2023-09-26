// multer.js

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder for file uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split('.')[0];
    cb(null, filename + '-' + uniqueSuffix + '.png'); // Rename the uploaded file
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
