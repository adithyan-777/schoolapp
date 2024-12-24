const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/my_database';

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose Schema and Model
const ItemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
});

const Item = mongoose.model('Item', ItemSchema);

// Define Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Fetch all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new item
app.post('/items', async (req, res) => {
    const item = new Item(req.body);
    try {
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
