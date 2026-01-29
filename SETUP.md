# Trust Website - Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

Open a terminal in the project root directory and run:

```bash
npm install
```

This will install all required Node.js packages including Express, MySQL2, Multer, and other dependencies.

### 2. Database Setup

#### Option A: Using MySQL Command Line

1. Open MySQL command line:
   ```bash
   mysql -u root -p
   ```

2. Run the schema file:
   ```bash
   source database/schema.sql
   ```

#### Option B: Using MySQL Workbench or phpMyAdmin

1. Open MySQL Workbench or phpMyAdmin
2. Create a new database named `trust_db`
3. Import the `database/schema.sql` file

The schema will:
- Create all necessary tables
- Insert a default admin user (username: `admin`, password: `admin123`)
- Add sample program data

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your settings:

```env
# Update these with your MySQL credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=trust_db
DB_PORT=3306

# Change this to a secure random string
SESSION_SECRET=your_secure_session_secret_here

# Telegram Bot Configuration (Optional)
# Get these from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

#### Setting up Telegram Bot (Optional but Recommended):

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow the instructions
3. Copy the bot token to `TELEGRAM_BOT_TOKEN` in `.env`
4. Start a chat with your bot
5. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
6. Send a message to your bot, then refresh the URL
7. Copy your chat ID from the response to `TELEGRAM_CHAT_ID`

### 4. Start the Server

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## Accessing the Application

### Public Website
- Homepage: http://localhost:3000
- About: http://localhost:3000/pages/about.html
- Programs: http://localhost:3000/pages/programs.html
- Gallery: http://localhost:3000/pages/gallery.html
- Contact: http://localhost:3000/pages/contact.html

### Admin Panel
- Login: http://localhost:3000/admin/login.html
- Default credentials:
  - **Username:** admin
  - **Password:** admin123
  
**⚠️ IMPORTANT: Change the default admin password immediately after first login!**

## Admin Panel Features

Once logged in, you can:

1. **Dashboard** - View statistics and recent activity
2. **Programs** - Create, edit, and delete programs
3. **Gallery** - Upload and manage images
4. **Announcements** - Post announcements and events
5. **Enquiries** - View contact form submissions
6. **Reports** - Upload PDF reports

## File Upload Limits

- Images (Gallery/Programs): 10MB max
- PDF Reports: 20MB max
- Allowed image formats: JPEG, PNG, GIF, WebP
- Allowed document formats: PDF only

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure `trust_db` database exists

### Port Already in Use
- Change `PORT` in `.env` to a different port (e.g., 3001)

### File Upload Issues
- Check that `uploads/` directory exists and has write permissions
- Verify file size limits in `.env`

### Session/Login Issues
- Clear browser cookies
- Check `SESSION_SECRET` is set in `.env`

## Security Recommendations

1. **Change Default Password:**
   - Login to admin panel
   - Change the default `admin123` password immediately

2. **Session Secret:**
   - Generate a strong random string for `SESSION_SECRET`
   - Never commit `.env` file to version control

3. **Production Deployment:**
   - Set `NODE_ENV=production` in `.env`
   - Use HTTPS/SSL certificate
   - Configure firewall rules
   - Use environment variables instead of `.env` file
   - Set up regular database backups

4. **Database Security:**
   - Create a dedicated MySQL user for the application
   - Grant only necessary permissions
   - Use strong passwords

## Development vs Production

### Development
- Uses `nodemon` for auto-reload
- Detailed error messages
- Development-friendly logging

### Production
- Use a process manager like PM2:
  ```bash
  npm install -g pm2
  pm2 start server.js --name trust-website
  pm2 startup
  pm2 save
  ```

## Backup

### Database Backup
```bash
mysqldump -u root -p trust_db > backup.sql
```

### File Backup
Make sure to backup:
- `uploads/` directory
- `.env` file (store securely)
- Database dumps

## Support

For issues or questions:
- Check the README.md file
- Review the code comments
- Check server logs in the console

## License

MIT License - See LICENSE file for details
