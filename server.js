const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const { faker } = require('@faker-js/faker');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

// Import the database connection and models
const sequelize = require('./utils/database');
const Post = require('./models/post'); // Import model Post

const port = process.env.PORT;
const app = express();

// Fungsi untuk membuat data dummy post
async function createDummyPosts(count) {
  try {
    for (let i = 0; i < count; i++) {
      await Post.create({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        image_url: faker.image.urlPicsumPhotos(), // Generate URL gambar dummy
        creator: faker.internet.displayName(),
        created_at: faker.date.past(),
      });
    }
    console.log(`Berhasil membuat ${count} data dummy post!`);
  } catch (error) {
    console.error('Gagal membuat data dummy post:', error);
  }
}

/**
 * Configures the file storage settings for the multer middleware.
 *
 * The `fileStorage` object defines how uploaded files should be stored on the server.
 *
 * - `destination`: A function that determines the directory where uploaded files should be stored. In this case, it sets the destination to the 'images' directory.
 * - `filename`: A function that determines the filename for the uploaded file. It generates a unique filename by combining the current date/time and the original filename.
 */
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image_url')
);

app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(bodyParser.urlencoded()); //form data

//Fixing CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((error, req, res, next) => {
  console.log(`Error express: `, error);
  const status = error.statusCode || 500;
  const message = error.message;
  // const data = error.data;
  res.status(status).json({ message: message });
});

app.use('/feed', feedRoutes);

app.use('/api/auth', authRoutes);

// Start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
    // Membuat 500 data dummy post
    // createDummyPosts(9000);
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log('Connection database failed: ', err));
