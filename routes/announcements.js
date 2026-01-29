const express = require('express');
const { pool } = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Get all active announcements (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM announcements WHERE status = "active" ORDER BY created_at DESC LIMIT 10'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

// Get all announcements for admin
router.get('/admin/all', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM announcements ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

// Create announcement
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { title, content, type, event_date, status } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO announcements (title, content, type, event_date, status) VALUES (?, ?, ?, ?, ?)',
            [title, content, type || 'announcement', event_date || null, status || 'active']
        );

        res.json({ 
            success: true, 
            message: 'Announcement created successfully',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ error: 'Failed to create announcement' });
    }
});

// Update announcement
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { title, content, type, event_date, status } = req.body;
        const announcementId = req.params.id;

        await pool.query(
            'UPDATE announcements SET title = ?, content = ?, type = ?, event_date = ?, status = ? WHERE id = ?',
            [title, content, type, event_date || null, status || 'active', announcementId]
        );

        res.json({ success: true, message: 'Announcement updated successfully' });
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ error: 'Failed to update announcement' });
    }
});

// Delete announcement
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        await pool.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
});

module.exports = router;
