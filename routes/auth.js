const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const { sendPasswordChangeEmail } = require('../utils/email');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const [rows] = await pool.query(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const admin = rows[0];
        const isValidPassword = await bcrypt.compare(password, admin.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await pool.query(
            'UPDATE admins SET last_login = NOW() WHERE id = ?',
            [admin.id]
        );

        // Set session
        req.session.adminId = admin.id;
        req.session.username = admin.username;

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: { username: admin.username }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Check auth status
router.get('/status', (req, res) => {
    if (req.session && req.session.adminId) {
        res.json({ 
            authenticated: true,
            username: req.session.username 
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Change password
router.post('/change-password', isAuthenticated, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        const [rows] = await pool.query(
            'SELECT * FROM admins WHERE id = ?',
            [req.session.adminId]
        );

        const admin = rows[0];
        const isValidPassword = await bcrypt.compare(currentPassword, admin.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE admins SET password = ? WHERE id = ?',
            [hashedPassword, req.session.adminId]
        );

        // Send confirmation email
        const adminEmail = admin.email || process.env.ADMIN_EMAIL || 'admin@hopeharbor.org';
        const adminName = admin.name || admin.username || 'Administrator';
        await sendPasswordChangeEmail(adminEmail, adminName);

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;
