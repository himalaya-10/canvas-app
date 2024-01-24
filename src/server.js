const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Define a schema for the file location
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  filePath: { type: String, required: true },
});

// Create a model from the schema
const File = mongoose.model('File', fileSchema);

// Endpoint to save file location
app.post('/saveFile', async (req, res) => {
  const { filePath } = req.body;
  const newFile = new File({ filePath });

  try {
    await newFile.save();
    res.status(201).json(newFile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
