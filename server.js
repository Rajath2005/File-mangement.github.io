const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Optional, but useful for cross-origin requests

const app = express();

// Use dynamic port for deployment (Render, Heroku, etc.)
const PORT = process.env.PORT || 3000;

// Enable CORS if you are making API requests from a different domain
app.use(cors());

// Serve static files (like HTML, CSS, and JS) from the root directory (no public folder)
app.use(express.static(__dirname));
app.use(express.json());

// Define storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${timestamp}-${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// File upload route with password verification
app.post('/upload', upload.single('file'), (req, res) => {
    const password = req.body.password;
    const correctPassword = 'Rajath';  // Replace with your secure password

    if (password !== correctPassword) {
        return res.status(403).json({ success: false, message: 'Incorrect password!' });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded!' });
    }

    res.json({ success: true, message: 'File uploaded successfully!' });
});

// List uploaded files with their upload date and time
app.get('/files', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Unable to read files!' });
        }

        const fileDetails = files.map(file => ({
            name: file,
            uploadTime: fs.statSync(`uploads/${file}`).mtime.toLocaleString()
        }));

        res.json({ success: true, files: fileDetails });
    });
});

// Delete file with password verification
app.delete('/delete', (req, res) => {
    const { filename, code } = req.body;
    const correctCode = 'Kiran';  // Replace with your delete password

    if (code !== correctCode) {
        return res.status(403).json({ success: false, message: 'Incorrect delete code!' });
    }

    const filePath = path.join('uploads', filename);
    fs.unlink(filePath, err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error deleting file!' });
        }
        res.json({ success: true, message: 'File deleted successfully!' });
    });
});

// Download file route
app.get('/download/:file', (req, res) => {
    const file = path.join(__dirname, 'uploads', req.params.file);
    res.download(file);
});

// Catch-all route for undefined paths (to prevent "Cannot GET /" error)
app.get('*', (req, res) => {
    res.status(404).send('Route not found.');
});

// Start the server on the dynamic port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
