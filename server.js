const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Safa School Node API' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
