const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const path = require('path');
const cors = require('cors');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse application/json
app.use(bodyParser.json());

// Serve index.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://maheshyandrapu78:Mahesh%401234@mahesh.zit48.mongodb.net/?retryWrites=true&w=majority&appName=Mahesh')
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const tolerance = 0.05; // Define tolerance for point comparison

// Define User schema
const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String
});

// Define SelectedPoints schema
const selectedPointsSchema = new mongoose.Schema({
    username: { type: String, required: true },
    points: [{
        imageName: String,
        coordinates: {
            x: Number,
            y: Number
        }
    }]
});

const User = mongoose.model('User', userSchema);
const SelectedPoints = mongoose.model('SelectedPoints', selectedPointsSchema);

// Create public directory if it doesn't exist
const fs = require('fs');
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Move HTML files to public directory
['index.html', 'signup.html', 'signin.html'].forEach(file => {
  const source = path.join(__dirname, file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(source)) {
    fs.renameSync(source, dest);
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Username or email already exists' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

// Complete registration endpoint
app.post('/complete-registration', async (req, res) => {
    console.log('Received data for registration:', req.body); // Log incoming data

    try {
        const { name, username, email, password, selectedPoints } = req.body;

        // Validate incoming data
        if (!name) {
            console.error('Missing name');
            return res.status(400).json({ message: 'Missing required field: name' });
        }
        if (!username) {
            console.error('Missing username');
            return res.status(400).json({ message: 'Missing required field: username' });
        }
        if (!email) {
            console.error('Missing email');
            return res.status(400).json({ message: 'Missing required field: email' });
        }
        if (!password) {
            console.error('Missing password');
            return res.status(400).json({ message: 'Missing required field: password' });
        }
        if (!selectedPoints) {
            console.error('Missing selectedPoints');
            return res.status(400).json({ message: 'Missing required field: selectedPoints' });
        }

        // Store selected points in separate collection
        const formattedPoints = Object.values(selectedPoints).map(point => ({
            imageName: point.imageName,
            coordinates: point.coordinates
        }));

        const pointsDocument = new SelectedPoints({
            username: username,
            points: formattedPoints
        });

        await pointsDocument.save(); // Save points to the database
        console.log('Points saved successfully for user:', username); // Log success
        
        res.status(200).json({ message: 'Registration completed successfully' });
    } catch (error) {
        console.error('Error completing registration:', error);
        res.status(500).json({ message: 'Error completing registration' });
    }
});

// Compare selected points with stored points
app.post('/compare-points', async (req, res) => {
    const { username, selectedPoints } = req.body;

    console.log('Comparing points for user:', username);
    console.log('Selected Points:', selectedPoints);

    try {
        const storedPoints = await SelectedPoints.findOne({ username: username });
        if (!storedPoints) {
            console.error('No stored points found for user:', username);
            return res.status(404).json({ message: 'No stored points found for this user.' });
        }

        console.log('Stored Points:', storedPoints.points);

        let match = true;
        for (const selectedPoint of Object.values(selectedPoints)) {
            const storedPoint = storedPoints.points.find(point => point.imageName === selectedPoint.imageName);

            if (!storedPoint || 
                Math.abs(selectedPoint.coordinates.x - storedPoint.coordinates.x) > tolerance || 
                Math.abs(selectedPoint.coordinates.y - storedPoint.coordinates.y) > tolerance) {
                console.log(`Point does not match for image: ${selectedPoint.imageName}. Selected: (${selectedPoint.coordinates.x}, ${selectedPoint.coordinates.y}), Stored: (${storedPoint ? storedPoint.coordinates.x : 'N/A'}, ${storedPoint ? storedPoint.coordinates.y : 'N/A'})`);
                match = false;
                break;
            }
        }



        if (match) {
            res.status(200).json({ message: 'Points match successfully!' });
        } else {
            res.status(400).json({ message: 'Points do not match.' });
        }
    } catch (error) {
        console.error('Error comparing points:', error);
        res.status(500).json({ message: 'Error comparing points' });
    }
});

// Signin endpoint
app.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        });
        
        if (user) {
            res.status(200).json({ 
                message: 'Login successful',
                redirect: '/home.html?signin=success'
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/get-selected-points', async (req, res) => {
    const username = req.query.username;
    try {
        const points = await SelectedPoints.findOne({ username: username });
        if (points) {
            res.status(200).json(points.points);
        } else {
            res.status(404).json({ message: 'No points found for this user.' });
        }
    } catch (error) {
        console.error('Error fetching selected points:', error);
        res.status(500).json({ message: 'Error fetching selected points' });
    }
});

// Start server
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    server.close(() => {
      process.exit(0);
    });
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});
