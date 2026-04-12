# Development Guide - SumUP

Complete guide for setting up and developing SumUP locally.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Git

### 1. Clone and Install

```bash
git clone https://github.com/m4rc3l0bizoso/sumup.git
cd sumup

# Install dependencies
npm install --prefix backend
npm install --prefix frontend
```

### 2. Environment Configuration

Backend (`.env`):
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sumup_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Frontend
FRONTEND_URL=http://localhost:5173

# File uploads
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads
```

Frontend (`.env`):
```bash
cp frontend/.env.example frontend/.env
```

Default frontend `.env` should work for local development.

### 3. Database Setup

```bash
# Create database
createdb sumup_dev

# In the future, run migrations here (when database migrations are added)
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

## Project Structure

```
SumUP/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth, validation
│   │   ├── routes/            # API endpoints
│   │   └── server.ts          # Express app
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React 18 app
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API client
│   │   ├── hooks/             # Custom hooks
│   │   ├── styles/            # CSS/Tailwind
│   │   ├── App.tsx            # Main component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── shared/                     # Shared types
│   └── types.ts
│
└── README.md
```

## Available Scripts

### Backend
```bash
npm run dev          # Start development server with auto-reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled server
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code
```

## API Documentation

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

### Documents
```
POST /api/documents/upload          # Upload file (multipart/form-data)
POST /api/documents/upload-text     # Upload text
GET /api/documents/:id              # Get document
GET /api/documents/history          # Get user's documents
DELETE /api/documents/:id           # Delete document
```

### Summaries
```
POST /api/summaries/generate        # Generate summary
GET /api/summaries/:id              # Get summary
POST /api/summaries/:id/regenerate  # Regenerate with different ratio
GET /api/summaries/:id/export       # Export (PDF/TXT)
POST /api/summaries/:id/share       # Create share link
```

## Frontend Components

### Key Components
- **UploadZone**: Drag-and-drop file upload with multiple format support
- **SummaryDisplay**: Display summary with side-by-side comparison
- **AuthForm**: Login/Register form with validation
- **Layout**: Header, footer, and main layout structure

### Hooks
- `useAuth()`: Authentication management

### Services
- `api.ts`: Axios client with automatic token injection

## Backend Services

### SummarizerService
Extractive summarization using TF-IDF algorithm:
- Sentence tokenization and scoring
- Word frequency analysis
- Redundancy checking
- Key point extraction

### DocumentService
Document processing:
- PDF text extraction
- Image OCR (Tesseract.js)
- Text file reading
- Text statistics calculation

### StorageService
File management:
- Save uploaded files
- File validation
- Cleanup of old files

## Testing

### Run All Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Testing Guidelines
- Write tests for new features
- Aim for >80% code coverage
- Mock external dependencies
- Test error scenarios

## Debugging

### Backend
```bash
# With Node debugger
node --inspect-brk dist/server.js

# VS Code: Add to launch.json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Process",
  "port": 9229
}
```

### Frontend
- Open DevTools (F12)
- React DevTools browser extension
- Check browser console for errors

## Common Issues

### Port Already in Use
```bash
# Kill process using port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process using port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Create database if needed
createdb sumup_dev
```

### Module Not Found
```bash
# Reinstall node_modules
rm -rf backend/node_modules frontend/node_modules
npm install --prefix backend
npm install --prefix frontend
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build --prefix backend
```

### Xcode Command Line Tools Error (macOS)

**Error messages:**
```
xcode-select: error: invalid developer directory '/Library/Developer/CommandLineTools'

OR

No se puede instalar el software porque no está disponible en el servidor 
de actualizaciones de software
```

**Quick fixes:**
```bash
# 1. Try to install or reset Xcode command line tools
xcode-select --install

# 2. If that fails, reset the path
sudo xcode-select --reset

# 3. If still failing, check internet and date/time
date  # Verify date is correct

# 4. Accept Xcode license
sudo xcodebuild -license accept

# 5. Retry npm install
npm install --prefix backend
npm install --prefix frontend
```

**If "Software not available on server" error persists:**
```bash
# Clear network cache
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Clear Software Update cache
sudo rm -rf ~/Library/Caches/com.apple.dt.Xcode

# Try again
xcode-select --install
```

For detailed solutions and troubleshooting, see [SETUP.md - Xcode Command Line Tools Error](./SETUP.md#xcode-command-line-tools-error-macos)

## Code Style

We follow:
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety

### Format Code
```bash
npm run format --prefix backend
npm run format --prefix frontend
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Commit with descriptive messages
5. Push and create a pull request

## Performance Tips

### Backend
- Use async/await for I/O operations
- Implement caching where appropriate
- Optimize database queries
- Monitor memory usage

### Frontend
- Use React.memo for expensive components
- Implement code splitting
- Lazy load routes
- Optimize images

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use HTTPS in production
- [ ] Validate all user inputs
- [ ] Sanitize outputs
- [ ] Use secure headers
- [ ] Implement rate limiting
- [ ] Keep dependencies updated

## Deployment

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Environment Variables for Production
- Use strong JWT_SECRET
- Configure correct FRONTEND_URL
- Use production database
- Enable security headers
- Configure CORS properly

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages carefully
3. Check console logs
4. Create an issue on GitHub

---

Happy coding! 🚀
