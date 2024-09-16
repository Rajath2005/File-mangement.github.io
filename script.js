const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.use(express.static('public'));
app.use(express.json());

// Route to serve the README file
app.get('/readme', (req, res) => {
    res.sendFile(path.join(__dirname, 'readme.html'));
});

// Other existing routes...

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
