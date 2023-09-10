const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const Resume = require('./models/resume');

mongoose.connect('mongodb://localhost:27017/resumes', { useNewUrlParser: true, useUnifiedTopology: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('resume'), (req, res) => {
    const { originalname, path } = req.file;
    const resume = new Resume({ name: originalname, path });
    resume.save().then(() => {
        res.json({ message: 'Resume uploaded successfully' });
    });
});

app.get('/resumes', (req, res) => {
    Resume.find({})
        .exec()
        .then((resumes) => {
            res.json(resumes);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

app.get('/download/:id', (req, res) => {
    const resumeId = req.params.id;

    Resume.findById(resumeId)
        .then((resume) => {
            if (!resume) {
                res.status(404).json({ error: 'Resume not found' });
            } else {
                const filePath = path.join(__dirname, 'uploads', resume.name); // Construct full file path
                const fileStream = fs.createReadStream(filePath);

                // Set appropriate headers for file download
                res.setHeader('Content-Type', 'application/pdf'); // Adjust content type as needed
                res.setHeader('Content-Disposition', `attachment; filename="${resume.name}"`);

                // Pipe the resume file to the response
                fileStream.pipe(res);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
