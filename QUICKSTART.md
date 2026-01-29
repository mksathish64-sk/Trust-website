# Quick Start Guide

## First Time Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
# Login to MySQL
mysql -u root -p

# Run this command in MySQL:
source database/schema.sql
```

Or manually:
1. Create database: `CREATE DATABASE trust_db;`
2. Import `database/schema.sql` using MySQL Workbench

### Step 3: Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env and update:
# - DB_PASSWORD (your MySQL password)
# - SESSION_SECRET (any random string)
```

### Step 4: Start Server
```bash
# For development
npm run dev

# OR for production
npm start
```

### Step 5: Access Application

**Public Site:** http://localhost:3000

**Admin Panel:** http://localhost:3000/admin
- Username: `admin`
- Password: `admin123`

**⚠️ CHANGE ADMIN PASSWORD AFTER FIRST LOGIN!**

---

## Optional: Telegram Integration

To receive contact form submissions on Telegram:

1. Open Telegram, search for `@BotFather`
2. Send `/newbot` and create your bot
3. Copy the bot token
4. Start a chat with your bot
5. Get your chat ID from: `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Add both to `.env` file:
   ```
   TELEGRAM_BOT_TOKEN=your_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```

---

## Troubleshooting

**Database error?**
- Check MySQL is running
- Verify password in `.env`

**Port 3000 in use?**
- Change PORT in `.env` to 3001

**Can't login?**
- Default is admin/admin123
- Clear browser cookies

---

## Next Steps

1. Login to admin panel
2. Change admin password
3. Add your programs
4. Upload gallery images
5. Create announcements
6. Customize content

See `SETUP.md` for detailed instructions.
