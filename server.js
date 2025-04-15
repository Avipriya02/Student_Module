const express = require('express');
const { connectDB } = require('./config/database');
const app = express();
const router = require('./routes/studentRoute');

// Middleware to parse JSON requests
app.use(express.json());

// Register student routes
app.use('/', router);

const PORT = process.env.PORT || 8800;

// Connect to the database, then start the server
connectDB()
  .then(() => {
    console.log('Database Connected Successfully!');
    app.listen(PORT, () => {
      console.log(`Server is listening at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Database Is Not Connected Successfully!');
    console.error(err); // Log detailed error
  });
