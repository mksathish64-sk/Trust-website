const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const programRoutes = require('./routes/programs');
const galleryRoutes = require('./routes/gallery');
const announcementRoutes = require('./routes/announcements');
const enquiryRoutes = require('./routes/enquiries');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
}));
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/reports', reportRoutes);

// Serve public pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
    try {
        // Test database connection
        await testConnection();
        
        // Get local IP address
        const os = require('os');
        const networkInterfaces = os.networkInterfaces();
        let localIP = 'localhost';
        
        for (const interfaceName in networkInterfaces) {
            const interfaces = networkInterfaces[interfaceName];
            for (const iface of interfaces) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    localIP = iface.address;
                    break;
                }
            }
        }
        
        app.listen(PORT, HOST, () => {
            console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           Trust Website Server Started                        ║
╠═══════════════════════════════════════════════════════════════╣
║  🌐 Local:    http://localhost:${PORT}                        ║
║  🌐 Network:  http://${localIP}:${PORT}                       ║
║  📊 Environment: ${process.env.NODE_ENV || 'development'}     ║
║  🔒 Admin:    http://${localIP}:${PORT}/admin                 ║
║                                                                ║
║  📱 Share the Network URL with friends on the same VPN/WiFi   ║
╚═══════════════════════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
