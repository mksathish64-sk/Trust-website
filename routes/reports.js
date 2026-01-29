const express = require('express');
const { pool } = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { uploadReport } = require('../config/upload');
const { deleteFile } = require('../utils/helpers');

const router = express.Router();

// Get all reports (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM reports ORDER BY year DESC, upload_date DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Upload report
router.post('/', isAuthenticated, uploadReport.single('file'), async (req, res) => {
    try {
        const { title, description, year } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'PDF file is required' });
        }

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const file_url = `/uploads/reports/${req.file.filename}`;

        const [result] = await pool.query(
            'INSERT INTO reports (title, description, file_url, year) VALUES (?, ?, ?, ?)',
            [title, description || '', file_url, year || new Date().getFullYear()]
        );

        res.json({ 
            success: true, 
            message: 'Report uploaded successfully',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error uploading report:', error);
        res.status(500).json({ error: 'Failed to upload report' });
    }
});

// Update report details
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { title, description, year } = req.body;
        const reportId = req.params.id;

        await pool.query(
            'UPDATE reports SET title = ?, description = ?, year = ? WHERE id = ?',
            [title, description || '', year, reportId]
        );

        res.json({ success: true, message: 'Report updated successfully' });
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: 'Failed to update report' });
    }
});

// Delete report
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reports WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Delete PDF file
        if (rows[0].file_url) {
            deleteFile('public' + rows[0].file_url);
        }

        await pool.query('DELETE FROM reports WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Failed to delete report' });
    }
});

module.exports = router;
