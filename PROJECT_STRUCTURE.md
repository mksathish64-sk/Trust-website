# Trust Website - Project Structure

```
trust-website/
│
├── server.js                   # Main Express server file
├── package.json               # Node.js dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── README.md                # Project overview and features
├── SETUP.md                 # Detailed setup instructions
├── QUICKSTART.md            # Quick start guide
│
├── config/                   # Configuration files
│   ├── database.js          # MySQL connection pool
│   └── upload.js            # Multer file upload configuration
│
├── middleware/              # Express middleware
│   └── auth.js             # Authentication middleware
│
├── routes/                  # API route handlers
│   ├── auth.js             # Authentication routes (login, logout)
│   ├── programs.js         # Programs CRUD operations
│   ├── gallery.js          # Gallery image management
│   ├── announcements.js    # Announcements and events
│   ├── enquiries.js        # Contact form submissions
│   └── reports.js          # PDF reports management
│
├── utils/                   # Utility functions
│   ├── telegram.js         # Telegram bot integration
│   └── helpers.js          # Helper functions (validation, file ops)
│
├── database/               # Database files
│   └── schema.sql         # MySQL database schema & sample data
│
├── public/                # Static files (served by Express)
│   │
│   ├── index.html         # Homepage
│   │
│   ├── css/               # Stylesheets
│   │   ├── style.css     # Main public site styles
│   │   └── admin.css     # Admin panel styles
│   │
│   ├── js/                # JavaScript files
│   │   ├── main.js       # Common functions (nav, notifications)
│   │   ├── home.js       # Homepage specific scripts
│   │   └── admin.js      # Admin panel common functions
│   │
│   ├── pages/             # Public pages
│   │   ├── about.html    # About Trust page
│   │   ├── programs.html # Programs listing & details
│   │   ├── gallery.html  # Photo gallery with lightbox
│   │   └── contact.html  # Contact form
│   │
│   └── admin/             # Admin panel pages
│       ├── index.html         # Redirect to login
│       ├── login.html         # Admin login page
│       ├── dashboard.html     # Admin dashboard
│       ├── programs.html      # Manage programs
│       ├── gallery.html       # Manage gallery
│       ├── announcements.html # Manage announcements
│       ├── enquiries.html     # View enquiries
│       └── reports.html       # Manage PDF reports
│
└── uploads/               # User uploaded files (created at runtime)
    ├── gallery/          # Gallery images
    ├── programs/         # Program images
    └── reports/          # PDF reports
```

## Key Files Explained

### Backend

#### `server.js`
- Main Express application
- Configures middleware (helmet, session, body-parser)
- Mounts API routes
- Serves static files
- Handles errors

#### `config/database.js`
- MySQL connection pool
- Connection testing function
- Database configuration from environment variables

#### `config/upload.js`
- Multer configuration for file uploads
- Separate storage configs for gallery, programs, reports
- File type validation
- File size limits

#### `middleware/auth.js`
- `isAuthenticated`: Protects admin routes
- `isNotAuthenticated`: Redirects logged-in users

#### Routes (`routes/*.js`)
Each route file handles specific resource operations:
- GET: Retrieve data
- POST: Create new records
- PUT: Update existing records
- DELETE: Remove records

### Frontend

#### Public Pages
- **index.html**: Homepage with hero slider, announcements preview
- **about.html**: Mission, vision, values, impact stats
- **programs.html**: Dynamic program listing with detail view
- **gallery.html**: Image grid with lightbox viewer
- **contact.html**: Contact form with validation

#### Admin Panel
- **login.html**: Admin authentication
- **dashboard.html**: Statistics and recent activity
- **programs.html**: CRUD interface for programs
- **gallery.html**: Image upload and management
- **announcements.html**: Create/edit announcements
- **enquiries.html**: View and manage contact submissions
- **reports.html**: Upload and manage PDF reports

#### Stylesheets
- **style.css**: Global styles, navigation, cards, forms, animations
- **admin.css**: Admin-specific layouts, tables, modals, sidebar

#### JavaScript
- **main.js**: Navigation, notifications, API helper, animations
- **home.js**: Load announcements and programs for homepage
- **admin.js**: Auth check, logout, API calls, date formatting

## Database Schema

### Tables
1. **admins**: Admin user accounts
2. **programs**: Trust programs and initiatives
3. **gallery**: Photo gallery images
4. **announcements**: Announcements and events
5. **enquiries**: Contact form submissions
6. **reports**: Uploaded PDF reports

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/status` - Check auth status
- `POST /api/auth/change-password` - Update password

### Programs
- `GET /api/programs` - Get all active programs (public)
- `GET /api/programs/:id` - Get single program (public)
- `GET /api/programs/admin/all` - Get all programs (admin)
- `POST /api/programs` - Create program (admin)
- `PUT /api/programs/:id` - Update program (admin)
- `DELETE /api/programs/:id` - Delete program (admin)

### Gallery
- `GET /api/gallery` - Get all images
- `POST /api/gallery` - Upload image (admin)
- `PUT /api/gallery/:id` - Update image details (admin)
- `DELETE /api/gallery/:id` - Delete image (admin)

### Announcements
- `GET /api/announcements` - Get active announcements (public)
- `GET /api/announcements/admin/all` - Get all (admin)
- `POST /api/announcements` - Create (admin)
- `PUT /api/announcements/:id` - Update (admin)
- `DELETE /api/announcements/:id` - Delete (admin)

### Enquiries
- `POST /api/enquiries` - Submit enquiry (public)
- `GET /api/enquiries` - Get all enquiries (admin)
- `PUT /api/enquiries/:id/status` - Update status (admin)
- `DELETE /api/enquiries/:id` - Delete (admin)

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Upload report (admin)
- `PUT /api/reports/:id` - Update details (admin)
- `DELETE /api/reports/:id` - Delete report (admin)

## Features

### Public Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Hero slider with smooth transitions
- ✅ Animated page elements
- ✅ Dynamic content loading
- ✅ Image gallery with lightbox
- ✅ Contact form with validation
- ✅ Telegram integration for enquiries

### Admin Features
- ✅ Secure session-based authentication
- ✅ Dashboard with statistics
- ✅ CRUD operations for all content
- ✅ File upload handling (images & PDFs)
- ✅ Status management for enquiries
- ✅ Responsive admin layout

### Security Features
- ✅ Password hashing (bcryptjs)
- ✅ Session management (express-session)
- ✅ Security headers (helmet)
- ✅ File upload validation
- ✅ Input sanitization
- ✅ CSRF protection ready

## Technology Stack

**Backend:**
- Node.js
- Express.js
- MySQL2 (with promises)
- bcryptjs (password hashing)
- express-session (authentication)
- multer (file uploads)
- axios (Telegram integration)
- helmet (security)

**Frontend:**
- HTML5
- CSS3 (with CSS Grid & Flexbox)
- Vanilla JavaScript (ES6+)
- No external UI frameworks (lightweight)

## Deployment Checklist

- [ ] Change default admin password
- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Configure Telegram bot
- [ ] Setup SSL certificate
- [ ] Configure firewall
- [ ] Setup automatic backups
- [ ] Use PM2 or similar process manager
- [ ] Setup monitoring/logging
- [ ] Test all features
