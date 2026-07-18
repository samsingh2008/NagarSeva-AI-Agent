# NagarSeva - AI Urban Service Management Platform

An AI-powered full-stack platform for urban service management built with Next.js, Express, MongoDB, and Gemini AI.

## 🏗️ Project Structure

```
NagarSeva/
├── client/                 # Frontend (Next.js + React)
│   ├── app/               # Next.js app directory
│   │   ├── (routes)/      # Route segments (group folders)
│   │   ├── api/           # API routes (optional)
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable React components
│   │   ├── common/        # Common UI components (Header, Footer, etc.)
│   │   └── ui/            # Basic UI elements (Button, Input, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries and helpers
│   ├── styles/            # Global styles and CSS
│   ├── utils/             # Utility functions
│   ├── public/            # Static assets (images, fonts, etc.)
│   ├── package.json       # Client dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── next.config.js     # Next.js configuration
│
├── server/                # Backend (Express + Node.js)
│   ├── src/
│   │   ├── routes/        # API route definitions
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── services/      # Business logic and external integrations
│   │   ├── middleware/    # Express middleware (auth, validation, etc.)
│   │   ├── config/        # Configuration files (DB, Gemini AI, etc.)
│   │   ├── utils/         # Utility functions
│   │   ├── schemas/       # Validation schemas (Joi, Zod, etc.)
│   │   └── index.ts       # Server entry point
│   ├── dist/              # Compiled JavaScript output
│   ├── package.json       # Server dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   ├── .eslintrc.json     # ESLint configuration
│   └── nodemon.json       # Nodemon config (auto-reload on changes)
│
├── docs/                  # Documentation
│   ├── API.md             # API documentation
│   ├── ARCHITECTURE.md    # Architecture decisions
│   └── SETUP.md           # Setup instructions
│
├── package.json           # Root package.json (workspace scripts)
├── .gitignore             # Git ignore rules
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 📂 Folder Descriptions

### Client (`/client`) - Next.js Frontend

- **`app/`** - Next.js App Router directory
  - **`(routes)/`** - Route groups for organizing pages (optional)
  - **`api/`** - Optional server-side API routes (API forwarding)
  - **`layout.tsx`** - Root layout wrapper
  - **`page.tsx`** - Home page

- **`components/`** - Reusable React components
  - **`common/`** - Shared layout components (Header, Navigation, Footer)
  - **`ui/`** - Atomic UI components (Button, Card, Modal, Input, etc.)

- **`hooks/`** - Custom React hooks for state management and logic reuse
  - Example: `useApi`, `useAuth`, `useFetch`

- **`lib/`** - Utility libraries and API clients
  - Example: Axios instance, API client, helper functions

- **`styles/`** - Global styles and CSS
  - `globals.css` - Tailwind directives and global styles

- **`utils/`** - Pure utility functions
  - Example: formatters, validators, converters

- **`public/`** - Static assets served directly
  - Images, fonts, SVGs, favicons

### Server (`/server`) - Express Backend

- **`src/routes/`** - API route definitions
  - Organize by feature (e.g., `userRoutes.ts`, `reportRoutes.ts`)

- **`src/controllers/`** - Request handlers
  - Extract business logic from routes
  - Handle HTTP requests and responses

- **`src/models/`** - MongoDB schemas using Mongoose
  - Define data structure and validation

- **`src/services/`** - Business logic and external integrations
  - **Gemini AI service** - Integration with Google Gemini API
  - Database queries, data processing
  - Third-party API calls

- **`src/middleware/`** - Express middleware
  - Authentication, authorization
  - Error handling, logging
  - Request validation

- **`src/config/`** - Configuration files
  - **`database.ts`** - MongoDB connection setup
  - **`gemini.ts`** - Gemini AI initialization
  - Environment-specific configs

- **`src/utils/`** - Utility functions
  - Helpers, validators, formatters
  - Shared utilities used across services

- **`src/schemas/`** - Validation schemas
  - Request validation (using Joi, Zod, or similar)
  - Input sanitization

- **`src/index.ts`** - Server entry point
  - Express app setup, middleware configuration
  - Route registration, error handling

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key

### Environment Setup

1. Copy `.env.example` to `.env` (at root) and configure:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required values:
   - `GEMINI_API_KEY` - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - `MONGODB_URI` - Your MongoDB connection string
   - `NEXT_PUBLIC_API_URL` - Frontend API endpoint

### Installation

```bash
# Install root dependencies (concurrently for dev mode)
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Running the Project

```bash
# From root directory - runs both client and server in parallel
npm run dev

# Or run separately:
npm run dev:client    # Runs on http://localhost:3000
npm run dev:server    # Runs on http://localhost:5000
```

### Build & Production

```bash
# Build both client and server
npm run build

# Start production servers
npm start
```

## 📦 Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 | React framework with server components |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Backend | Express.js | Node.js HTTP server framework |
| Database | MongoDB | NoSQL document database |
| ODM | Mongoose | MongoDB object modeling |
| AI | Gemini AI | Google's generative AI model |
| Language | TypeScript | Type-safe JavaScript |
| HTTP Client | Axios | Promise-based HTTP client |

## 📝 Development Workflow

1. **Create a feature branch** from `main`
2. **Frontend changes** → Update components in `/client`
3. **Backend changes** → Update services/controllers in `/server`
4. **Test locally** → Use `npm run dev`
5. **Commit and push** → Follow conventional commits
6. **Create a pull request**

## 🔒 Environment Variables

### Client
- `NEXT_PUBLIC_API_URL` - Backend API base URL

### Server
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)
- `GEMINI_API_KEY` - Google Gemini API key
- `JWT_SECRET` - JWT signing secret (optional, for auth)
- `CORS_ORIGIN` - CORS allowed origin (default: http://localhost:3000)

## 📚 Documentation

- **[API Documentation](./docs/API.md)** - API endpoints and payloads
- **[Architecture](./docs/ARCHITECTURE.md)** - Design decisions and patterns
- **[Setup Guide](./docs/SETUP.md)** - Detailed setup instructions

## 🤝 Contributing

1. Follow the project structure
2. Keep components small and reusable
3. Use TypeScript for type safety
4. Write meaningful commit messages
5. Test before committing

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

Built for the AI Hackathon - NagarSeva Team

---

**Ready to develop! Happy coding! 🚀**
