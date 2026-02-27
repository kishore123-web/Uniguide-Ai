const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const apiRoutes = require('./routes/api');
const scholarshipRoutes = require('./routes/scholarships');
const choiceFillingRoutes = require('./routes/choiceFilling');
app.use('/api', apiRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/choice-filling', choiceFillingRoutes);

const alternatePathRoutes = require('./routes/alternatePathRoutes');
app.use('/api/alternate-path', alternatePathRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('TNEA College Predictor API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
