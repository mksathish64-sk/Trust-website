const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { sendToTelegram, formatContactMessage } = require('../utils/telegram');
const { validateEmail, validatePhone } = require('../utils/helpers');

const router = express.Router();

// Submit contact enquiry (public)
router.post('/', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, subject, message } = req.body;

        // Additional validation
        if (phone && !validatePhone(phone)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        const [result] = await pool.query(
            'INSERT INTO enquiries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone || null, subject || null, message]
        );

        // Send to Telegram
        const telegramMessage = formatContactMessage({ name, email, phone, subject, message });
        await sendToTelegram(telegramMessage);

        res.json({ 
            success: true, 
            message: 'Your enquiry has been submitted successfully. We will get back to you soon!'
        });
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        res.status(500).json({ error: 'Failed to submit enquiry' });
    }
});

// Get all enquiries (admin only)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM enquiries ORDER BY submitted_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
});

// Update enquiry status
router.put('/:id/status', isAuthenticated, async (req, res) => {
    try {
        const { status } = req.body;
        const enquiryId = req.params.id;

        if (!['new', 'read', 'responded'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await pool.query(
            'UPDATE enquiries SET status = ? WHERE id = ?',
            [status, enquiryId]
        );

        res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Delete enquiry
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        await pool.query('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Enquiry deleted successfully' });
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).json({ error: 'Failed to delete enquiry' });
    }
});

module.exports = router;
