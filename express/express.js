const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser middleware
const app = express();
const port = 3000; // Set your desired port number

// Middleware to parse incoming request bodies as JSON
app.use(bodyParser.json());

// Endpoint to receive form data and process it
app.post('/SearchFlight', (req, res) => {
    const formData = req.body; // Assuming Express.js is used for handling requests

    // Process form data as needed
    // For example, you can save it to a database, perform additional validation, etc.

    // Send response back to Zend project if needed
    // You can send a success message or any other relevant information
    res.status(200).send('Form data received and processed successfully');
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
