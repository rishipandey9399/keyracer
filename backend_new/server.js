const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/keyracer';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
require('./User');
require('./CoderacerStats');

// Routes
const coderacerLeaderboardRoutes = require('./coderacerLeaderboardRoutes');
app.use('/api', coderacerLeaderboardRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const mongoState = mongoose.connection.readyState;
    let mongoStatus = 'unknown';
    switch (mongoState) {
      case 0: mongoStatus = 'disconnected'; break;
      case 1: mongoStatus = 'connected'; break;
      case 2: mongoStatus = 'connecting'; break;
      case 3: mongoStatus = 'disconnecting'; break;
    }
    res.json({ status: 'ok', mongo: mongoStatus });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`KeyRacer backend running on port ${PORT}`);
});
