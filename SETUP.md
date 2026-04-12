# SumUP Setup Guide

Professional Document Summarizer - Complete Setup Instructions

## System Requirements

### Minimum
- Node.js 18.0.0 or higher
- PostgreSQL 12 or higher
- npm 8.0.0 or higher
- 4GB RAM
- 2GB free disk space

### Recommended
- Node.js 20+ (LTS)
- PostgreSQL 15+
- npm 9+
- 8GB+ RAM
- SSD storage

## Installation Steps

### Step 1: Install System Dependencies

#### macOS (using Homebrew)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
```

#### Windows
1. Download and install Node.js from https://nodejs.org/
2. Download and install PostgreSQL from https://www.postgresql.org/download/windows/
3. During installation, remember the PostgreSQL password

### Step 2: Clone Repository

```bash
# Using HTTPS
git clone https://github.com/m4rc3l0bizoso/sumup.git
cd sumup

# Or using SSH
git clone git@github.com:m4rc3l0bizoso/sumup.git
cd sumup
```

### Step 3: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 4: Database Setup

#### Create Database User (if needed)

**macOS/Linux:**
```bash
# Connect to PostgreSQL
psql postgres

# Create user
CREATE USER sumup_user WITH PASSWORD 'your_secure_password';
ALTER USER sumup_user CREATEDB;
\q
```

**Windows:**
Use pgAdmin (comes with PostgreSQL) or:
```bash
# Open pgAdmin and create user through GUI
```

#### Create Database

```bash
# macOS/Linux
createdb -U sumup_user sumup_dev

# Windows (in PostgreSQL shell)
CREATE DATABASE sumup_dev;
```

### Step 5: Environment Configuration

#### Backend Configuration

```bash
# Copy example file
cp backend/.env.example backend/.env

# Edit the .env file (use any text editor)
# Recommended: VS Code, nano, vim
```

Edit `backend/.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database (adjust to your setup)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sumup_dev
DB_USER=sumup_user
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key-at-least-32-characters

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=debug
```

#### Frontend Configuration

```bash
# Copy example file
cp frontend/.env.example frontend/.env
```

`frontend/.env` (default should work):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SumUP
```

### Step 6: Verify Setup

```bash
# Test Node.js
node --version  # Should be v18+

# Test npm
npm --version   # Should be 8+

# Test PostgreSQL connection
psql -U sumup_user -d sumup_dev -c "SELECT 1;"
# Should return: SELECT 1 / 1 / (1 row)
```

### Step 7: Start Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
# Expected output:
# ✅ SumUP Backend running on port 5000
```

#### Terminal 2 - Frontend Application
```bash
cd frontend
npm run dev
# Expected output:
# ✅ VITE v5.0.0 ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

## First Use

### Create Account
1. Click "Sign up"
2. Enter email, password (8+ chars), and full name
3. Click "Create Account"

### Test Summarizer
1. Click "Upload File" or "Paste Text"
2. Upload a PDF, image, or paste text
3. Click "Summarize"
4. View results and try different summary lengths

## Common Setup Issues

### PostgreSQL Connection Failed
```bash
# Check PostgreSQL is running
# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Windows:
# Open Services and check PostgreSQL status
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Module 'tesseract.js' not found
```bash
# Rebuild native modules
cd backend
npm rebuild

# Or reinstall OCR dependencies
npm install --build=from-source tesseract.js
```

### Xcode Command Line Tools Error (macOS)

**Error 1: Invalid developer directory**
```
xcode-select: error: invalid developer directory '/Library/Developer/CommandLineTools'
Failed during: /usr/bin/sudo /usr/bin/xcode-select --switch /Library/Developer/CommandLineTools
```

**Error 2: Software not available on update server**
```
No se puede instalar el software porque no está disponible en el servidor 
de actualizaciones de software
```

**Solution:**

#### For Error 1 (Invalid directory):

**Option 1: Install Xcode Command Line Tools (Recommended)**
```bash
# Install Xcode command line tools
xcode-select --install

# When prompted, click "Install" to download and install the tools
# This may take 10-15 minutes

# Verify installation
xcode-select -p
# Should output: /Applications/Xcode.app/Contents/Developer
# OR: /Library/Developer/CommandLineTools
```

**Option 2: Reset Xcode Path**
```bash
# If Xcode is already installed but path is broken
sudo xcode-select --reset

# Verify it worked
xcode-select -p
```

**Option 3: Set Xcode Path Manually**
```bash
# If you have Xcode installed separately
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Verify
xcode-select -p
```

#### For Error 2 (Software not available on server):

This error occurs when macOS cannot download from Apple's servers. Try these solutions:

**Solution 1: Check Internet Connection**
```bash
# Test connectivity to Apple servers
ping -c 3 apple.com
curl -I https://developer.apple.com
```

**Solution 2: Set Correct Date/Time**
```bash
# Date/time issues can prevent downloads
# Go to: System Preferences > Date & Time
# Or use terminal:
date  # Check current date/time

# If incorrect, set it manually or enable "Set date and time automatically"
```

**Solution 3: Reset Network Settings**
```bash
# Sometimes network cache causes issues
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Restart WiFi
networksetup -setairportpower en0 off
sleep 2
networksetup -setairportpower en0 on
```

**Solution 4: Clear Software Update Cache**
```bash
# Remove cached updates
sudo rm -rf /var/db/software_update_check.plist
sudo rm -rf ~/Library/Caches/com.apple.dt.Xcode
sudo rm -rf ~/Library/Caches/com.apple.nsurlsessiond

# Try installation again
xcode-select --install
```

**Solution 5: Install via App Store (Alternative)**
```bash
# If command line install fails, try installing Xcode from App Store
# Then use it as the default:
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Accept license
sudo xcodebuild -license accept
```

**Solution 6: Download Directly from Apple (If all else fails)**
```bash
# Visit: https://developer.apple.com/download/
# Login with Apple ID
# Download "Command Line Tools for Xcode" directly
# Install the .dmg file manually
```

#### After Fixing Xcode Tools:

```bash
# Accept Xcode license
sudo xcodebuild -license accept

# Then retry npm install
cd backend
npm install

cd ../frontend
npm install
```

**If npm still fails:**
```bash
# Clear npm cache completely
npm cache clean --force

# Delete all node_modules
rm -rf backend/node_modules frontend/node_modules

# Reinstall with verbose output
npm install --verbose --prefix backend
npm install --verbose --prefix frontend
```

**Verify Xcode tools are working:**
```bash
# Check that build tools are accessible
gcc --version
make --version
g++ --version

# All should return version information, not errors
```

#### Troubleshooting Checklist:
- [ ] Internet connection is stable
- [ ] Date and time are correct
- [ ] No VPN or proxy blocking Apple servers
- [ ] Enough disk space available (at least 5GB)
- [ ] Not behind strict firewall
- [ ] Apple's servers are not down (check: https://www.apple.com/systatus/)

## Production Setup

### Build for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Environment Variables (Production)

```env
# backend/.env
NODE_ENV=production
PORT=5000

# Use strong secrets!
JWT_SECRET=generate-a-random-32-character-string-using-crypto
DB_PASSWORD=use-a-strong-password

# Use production domain
FRONTEND_URL=https://yourdomain.com
```

### Deploy

1. Build both applications
2. Deploy backend to your server
3. Deploy frontend to CDN or static hosting
4. Configure database on production server
5. Set environment variables on deployment platform

## System-Specific Notes

### macOS M1/M2 (Apple Silicon)
```bash
# Some packages might need specific build flags
npm install --build=from-source

# If issues persist with Tesseract:
npm install tesseract.js@v5
```

### Windows WSL2
```bash
# Use WSL2 (not WSL1)
# Install Node from within WSL2

# Ensure PostgreSQL connection works
psql -U postgres -c "SELECT 1;"
```

### Docker (Optional)

```bash
# Build Docker image
docker-compose up -d

# This starts:
# - PostgreSQL on port 5432
# - Backend on port 5000
# - Frontend on port 5173
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: sumup_dev
      POSTGRES_USER: sumup_user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Verification Checklist

- [ ] Node.js version 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] Backend `.env` configured correctly
- [ ] Frontend `.env` configured correctly
- [ ] Dependencies installed (npm install)
- [ ] Backend runs without errors (`npm run dev`)
- [ ] Frontend runs without errors (`npm run dev`)
- [ ] Can access app at http://localhost:5173
- [ ] Can create account
- [ ] Can upload and summarize document

## Next Steps

1. Read [DEVELOPMENT.md](./DEVELOPMENT.md) for development guide
2. Read [README.md](./README.md) for project overview
3. Check `backend/README.md` for API details
4. Review code in `src/` directories

## Support

- Check [DEVELOPMENT.md](./DEVELOPMENT.md) troubleshooting section
- Review error messages in console
- Check application logs in `uploads/` directory
- Create issue on GitHub with error details

## Getting Help

If you encounter issues:

1. **Check Logs**: Look at terminal output and browser console
2. **Verify Setup**: Re-read the corresponding section
3. **Search Issues**: Check GitHub issues for similar problems
4. **Ask for Help**: Create a new GitHub issue with:
   - Error message
   - Steps to reproduce
   - Your OS and Node version
   - What you've already tried

---

Welcome to SumUP! 🎉

For questions or issues, open an issue on GitHub.
