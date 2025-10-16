
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

// Fetch the Cat Fact API with 5s Timeout
const getCatFact = async () => {
  try {
    const response = await axios.get('https://catfact.ninja/fact', { timeout: 5000 });
    return response.data.fact;
  } catch (error) {
    console.error('❌ Error fetching cat fact:', error.message);
    return 'Could not fetch a cat fact at the moment. Try again later!';
  }
};

// GET /me
app.get('/me', async (req, res) => {
  try {
    const catFact = await getCatFact();

    const user = {
      email: process.env.USER_EMAIL,
      name: process.env.USER_NAME,
      stack: process.env.USER_STACK,
    };

    res.status(200).json({
      status: 'success',
      user,
      timestamp: new Date().toISOString(),
      fact: catFact,
    });
  } catch (err) {
    console.error('⚠️ Server Error:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong while processing your request.',
    });
  }
});

app.listen(PORT, () => console.log(`🌏 Server running at http://localhost:${PORT}/me`));
