const express = require('express');
const router = express.Router();
const Form = require('../models/Form'); // Ensure this path matches the location of your Form model

// GET a form entry by ID
router.get('/form/:id', async (req, res) => {
    try {
        const formEntry = await Form.findById(req.params.id);
        if (!formEntry) {
            return res.status(404).json({ message: "Form entry not found" });
        }
        res.json(formEntry);
    } catch (error) {
        console.error('Error fetching form entry:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Post a new form entry
router.post('/form', async (req, res) => {
    try {
        // Handle optional tests and reports
        if (req.body.tests && req.body.tests.length === 1 && !req.body.tests[0].testName) {
            req.body.tests = [];
        }
        if (req.body.reports && req.body.reports.length === 1 && !req.body.reports[0].reportName) {
            req.body.reports = [];
        }

        const newFormEntry = new Form(req.body);
        await newFormEntry.save();
        res.status(201).json(newFormEntry);
    } catch (error) {
        console.error('Error saving form:', error); // Enhanced error logging
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});



// Export the router for use in your main server file
module.exports = router;
