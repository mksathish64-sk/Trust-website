# Trust Website

A complete website for managing trust/NGO activities with admin panel.

## Features

### Public Pages
- Home page with sliders and animations
- About Trust page
- Programs listing
- Image Gallery
- Contact form with Telegram integration

### Admin Panel
- Secure admin-only login
- Manage programs (CRUD operations)
- Upload and manage gallery images
- Post announcements and events
- View contact enquiries
- Upload PDF reports

## Technologies

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **File Upload**: Multer
- **Security**: Helmet, bcryptjs, express-session
- **Integration**: Telegram Bot API

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your settings

4. Create MySQL database:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. Start the server:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

6. Access the website:
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## Default Admin Credentials

- Username: admin
- Password: admin123

**⚠️ Change these credentials immediately after first login!**

## Project Structure

```
trust-website/
├── public/              # Static files (HTML, CSS, JS, images)
│   ├── css/
│   ├── js/
│   ├── images/
│   └── pages/
├── uploads/             # User uploaded files
│   ├── gallery/
│   └── reports/
├── config/              # Configuration files
├── middleware/          # Express middleware
├── routes/              # API routes
├── database/            # Database schema and queries
├── utils/               # Utility functions
├── server.js            # Main application file
└── package.json
```

## Security Features

- Session-based authentication
- Password hashing with bcryptjs
- Secure file upload validation
- CSRF protection
- Helmet security headers
- Input validation and sanitization

## License

MIT
