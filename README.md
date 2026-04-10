# SumUP - Professional Document Summarizer

A modern, intuitive application for summarizing documents and extracting text from images. Built for university-level users with precision and fidelity.

## Features

- **Multi-format Support**: Upload PDFs, images (with OCR), or paste plain text
- **Faithful Summarization**: Extractive summarization algorithm that preserves original meaning
- **OCR Technology**: Extract text from images using Tesseract.js
- **User Authentication**: Secure account creation and login
- **Document History**: Save and access previous summaries
- **Adjustable Compression**: Fine-tune summary length from 10-90%
- **Key Points Extraction**: Automatic identification of main topics
- **Export Options**: Download summaries as PDF or TXT
- **Share Functionality**: Generate shareable links for summaries
- **Modern UI**: Clean, professional design with Tailwind CSS

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive design
- **Lucide React** for icons
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** for data persistence
- **Tesseract.js** for OCR
- **PDF.js** for PDF text extraction
- **JWT** for authentication
- **Bcrypt** for password hashing

## Project Structure

```
SumUP/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API services
│   │   ├── hooks/              # Custom hooks
│   │   ├── styles/             # CSS and Tailwind
│   │   ├── App.tsx             # Main component
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                     # Node.js/Express server
│   ├── src/
│   │   ├── services/           # Business logic
│   │   │   ├── summarizerService.ts    # TF-IDF summarization
│   │   │   └── documentService.ts      # OCR & PDF extraction
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   └── server.ts           # Express server
│   └── package.json
│
├── shared/                      # Shared types and utilities
│   └── types.ts                # TypeScript type definitions
│
└── README.md                    # This file
```

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/m4rc3l0bizoso/sumup.git
cd sumup
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Return to root
cd ..
```

3. **Environment Setup**

Backend (`.env`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials
```

Frontend (`.env`):
```bash
cp frontend/.env.example frontend/.env
# Default configuration should work for local development
```

4. **Database Setup**
```bash
# Create PostgreSQL database
createdb sumup

# Run migrations (if available)
cd backend
npm run migrate
```

## Running the Application

### Development Mode

Terminal 1 - Backend:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Production Build

Frontend:
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

Backend:
```bash
cd backend
npm run build
npm start
# Server runs on configured PORT
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Documents
- `POST /api/documents/upload` - Upload document file
- `POST /api/documents/upload-text` - Submit plain text
- `GET /api/documents/:id` - Get document details
- `GET /api/documents/history` - Get user's documents

### Summaries
- `POST /api/summaries/generate` - Generate summary
- `GET /api/summaries/:id` - Get summary details
- `POST /api/summaries/:id/regenerate` - Regenerate with different ratio
- `GET /api/summaries/:id/export` - Export summary
- `POST /api/summaries/:id/share` - Create share link

## Summarization Algorithm

SumUP uses a **TF-IDF based extractive summarization** approach:

1. **Tokenization**: Split text into sentences and words
2. **Scoring**: Calculate word frequency and IDF values
3. **Ranking**: Score sentences based on content value
4. **Selection**: Choose top sentences maintaining order
5. **Validation**: Ensure content fidelity

This approach preserves the original text and meaning, avoiding hallucinations or distortions.

## Features in Detail

### OCR Technology
- Supports multiple languages (Spanish and English optimized)
- Handles images at various resolutions
- Confidence scoring for text extraction

### PDF Processing
- Text extraction from multi-page PDFs
- Page count detection
- Maintains document structure

### User Experience
- Drag-and-drop file upload
- Real-time character counting
- Progress indicators
- Responsive mobile design
- One-click export and share

## Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## Security

- Password hashing with bcrypt
- JWT-based authentication
- CORS protection
- Input validation and sanitization
- Helmet.js for HTTP headers
- File type validation
- Rate limiting on API endpoints

## Performance

- Async document processing
- Caching mechanism for frequent queries
- Optimized PDF extraction
- Lazy loading of document previews
- CDN-ready frontend build

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

- Maximum file size: 50MB
- PDF extraction quality depends on PDF structure
- OCR accuracy varies with image quality
- Concurrent uploads limited per user

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check documentation in `/docs`
- Review API reference in comments

## Future Enhancements

- [ ] Advanced NLP models for better summarization
- [ ] Support for video transcript summarization
- [ ] Collaborative sharing and comments
- [ ] API rate limiting and usage analytics
- [ ] Mobile app (iOS/Android)
- [ ] Real-time collaboration features
- [ ] Multi-language support enhancement
- [ ] Custom summary templates

---

**Built with precision for academic excellence** ✓
