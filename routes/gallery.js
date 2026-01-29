const express = require('express');
const { pool } = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');
const { uploadGallery } = require('../config/upload');
const { deleteFile } = require('../utils/helpers');

const router = express.Router();

// Get all gallery images (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM gallery ORDER BY display_order DESC, upload_date DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

// Upload gallery image
router.post('/', isAuthenticated, uploadGallery.single('image'), async (req, res) => {
    try {
        const { title, description, display_order } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const image_url = `/uploads/gallery/${req.file.filename}`;

        const [result] = await pool.query(
            'INSERT INTO gallery (title, image_url, description, display_order) VALUES (?, ?, ?, ?)',
            [title || '', image_url, description || '', display_order || 0]
        );

        res.json({ 
            success: true, 
            message: 'Image uploaded successfully',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Update gallery image details
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { title, description, display_order } = req.body;
        const imageId = req.params.id;

        await pool.query(
            'UPDATE gallery SET title = ?, description = ?, display_order = ? WHERE id = ?',
            [title || '', description || '', display_order || 0, imageId]
        );

        res.json({ success: true, message: 'Gallery image updated successfully' });
    } catch (error) {
        console.error('Error updating gallery image:', error);
        res.status(500).json({ error: 'Failed to update image' });
    }
});

// Delete gallery image
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Delete image file
        if (rows[0].image_url) {
            deleteFile('public' + rows[0].image_url);
        }

        await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router;
