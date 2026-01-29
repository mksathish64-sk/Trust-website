const express = require('express');
const { pool } = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { uploadProgram } = require('../config/upload');
const { deleteFile } = require('../utils/helpers');

const router = express.Router();

// Get all programs (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM programs WHERE status = "active" ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ error: 'Failed to fetch programs' });
    }
});

// Get single program (public)
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM programs WHERE id = ? AND status = "active"',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Program not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).json({ error: 'Failed to fetch program' });
    }
});

// Get all programs for admin (includes inactive)
router.get('/admin/all', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM programs ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ error: 'Failed to fetch programs' });
    }
});

// Create program
router.post('/', isAuthenticated, uploadProgram.single('image'), async (req, res) => {
    try {
        const { title, description, full_description, status } = req.body;
        const image_url = req.file ? `/uploads/programs/${req.file.filename}` : null;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO programs (title, description, full_description, image_url, status) VALUES (?, ?, ?, ?, ?)',
            [title, description, full_description || description, image_url, status || 'active']
        );

        res.json({ 
            success: true, 
            message: 'Program created successfully',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error creating program:', error);
        res.status(500).json({ error: 'Failed to create program' });
    }
});

// Update program
router.put('/:id', isAuthenticated, uploadProgram.single('image'), async (req, res) => {
    try {
        const { title, description, full_description, status } = req.body;
        const programId = req.params.id;

        // Get existing program
        const [existing] = await pool.query('SELECT * FROM programs WHERE id = ?', [programId]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Program not found' });
        }

        let image_url = existing[0].image_url;

        // If new image uploaded, delete old one
        if (req.file) {
            if (existing[0].image_url) {
                deleteFile('public' + existing[0].image_url);
            }
            image_url = `/uploads/programs/${req.file.filename}`;
        }

        await pool.query(
            'UPDATE programs SET title = ?, description = ?, full_description = ?, image_url = ?, status = ? WHERE id = ?',
            [title, description, full_description || description, image_url, status || 'active', programId]
        );

        res.json({ success: true, message: 'Program updated successfully' });
    } catch (error) {
        console.error('Error updating program:', error);
        res.status(500).json({ error: 'Failed to update program' });
    }
});

// Delete program
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM programs WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Program not found' });
        }

        // Delete image file if exists
        if (rows[0].image_url) {
            deleteFile('public' + rows[0].image_url);
        }

        await pool.query('DELETE FROM programs WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Program deleted successfully' });
    } catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({ error: 'Failed to delete program' });
    }
});

module.exports = router;
