# NagarSeva - Project Overview

## Quick Start

1. **Read this file** - Understand the project structure (5 min)
2. **Run `docs/SETUP.md`** - Set up your environment (10 min)
3. **Explore the folders** - Familiarize yourself with the structure (5 min)
4. **Read `docs/ARCHITECTURE.md`** - Understand the design patterns (10 min)
5. **Start coding!** - Implement features following the patterns

---

## What is NagarSeva?

NagarSeva is an **AI-powered urban service management platform** being built for a hackathon. It helps cities manage and resolve urban service issues (potholes, street lights, waste management, etc.) using **Artificial Intelligence**.

### Key Features (To Be Implemented)

- **Issue Reporting** - Citizens report urban problems
- **AI Analysis** - Gemini AI analyzes issues for severity and solutions
- **Smart Routing** - Auto-assign issues to appropriate departments
- **Progress Tracking** - Real-time updates on issue resolution
- **Report Generation** - AI-generated resolution plans and timelines

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (React with Server Components)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **State**: React Hooks + Context API (or Zustand if needed)
- **HTTP Client**: Axios

### Backend
- **Framework**: Express.js (minimal Node.js HTTP server)
- **Language**: TypeScript (type-safe JavaScript)
- **Database**: MongoDB (with Mongoose ODM)
- **AI**: Google Gemini API (for LLM capabilities)
- **Validation**: Joi or Zod (schema validation)

### DevTools
- **Package Manager**: npm
- **Build Tool**: TypeScript Compiler (TSC)
- **Dev Server**: Next.js dev server + Nodemon (auto-reload)
- **Linting**: ESLint
- **Formatting**: Prettier (optional)

---

## Project Structure at a Glance

```
NagarSeva/
├── client/           → Frontend (Next.js + React)
│   ├── app/         → Pages and routes
│   ├── components/  → React components
│   ├── hooks/       → Custom React hooks
│   ├── lib/         → API client setup
│   ├── styles/      → Global CSS
│   └── utils/       → Helper functions
│
├── server/          → Backend (Express + Node.js)
│   └── src/
│       ├── routes/       → API endpoints
│       ├── controllers/  → Request handlers
│       ├── models/       → MongoDB schemas
│       ├── services/     → Business logic
│       ├── middleware/   → Express middleware
│       ├── config/       → Configuration
│       └── index.ts      → Server entry point
│
└── docs/            → Documentation
    ├── README.md              → Main documentation
    ├── SETUP.md               → Setup instructions
    ├── ARCHITECTURE.md        → Design patterns
    ├── API.md                 → API reference
    ├── FOLDER_STRUCTURE.txt   → Detailed folder guide
    └── PROJECT_OVERVIEW.md    → This file
```

---

## Key Concepts

### Frontend Architecture

**Request Flow:**
```
User Input → React Component → Custom Hook (useApi) → Axios → Backend API
     ↓
Response → State Update → Re-render → UI Updated
```

**File Organization:**
- **Pages** in `app/` - Route definitions
- **Components** in `components/` - Reusable UI pieces
- **Hooks** in `hooks/` - Logic extraction (useApi, useFetch)
- **Utils** in `utils/` - Pure helper functions
- **Styles** in `styles/` - Global CSS + Tailwind

### Backend Architecture

**Request Flow:**
```
HTTP Request
    ↓
Middleware (Auth, Validation)
    ↓
Route Handler
    ↓
Controller (HTTP handling)
    ↓
Service (Business logic)
    ↓
Model (Database access)
    ↓
Response (JSON)
```

**Separation of Concerns:**
- **Routes** - Define endpoints
- **Controllers** - Handle HTTP requests
- **Services** - Contain business logic
- **Models** - Define MongoDB schemas
- **Middleware** - Cross-cutting concerns

### Gemini AI Integration

**Usage Pattern:**
```
1. User reports issue
2. Frontend sends to backend
3. Backend calls Gemini Service
4. Gemini analyzes issue
5. Service returns structured data
6. Backend responds to frontend
7. Frontend displays analysis
```

---

## Environment Variables

### What You Need

Create a `.env` file at the project root with:

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nagarseva
NODE_ENV=development
GEMINI_API_KEY=your_key_from_google_ai_studio
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:3000
```

### Where to Get Them

1. **GEMINI_API_KEY** → https://makersuite.google.com/app/apikey
2. **MONGODB_URI** → Use MongoDB Atlas (cloud) or local MongoDB

---

## Running the Project

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Install client dependencies
cd client && npm install

# 3. Install server dependencies
cd ../server && npm install && cd ..

# 4. Create .env file with your keys

# 5. Start development servers
npm run dev
```

### Daily Development

```bash
# From project root
npm run dev

# This starts:
# - Frontend on http://localhost:3000
# - Backend on http://localhost:5000
```

### Check It's Working

- Frontend: http://localhost:3000 (should see NagarSeva homepage)
- Backend: http://localhost:5000/health (should return JSON message)

---

## Common Tasks

### Add a New Frontend Page

1. Create file: `client/app/(routes)/your-route/page.tsx`
2. Add content
3. Route automatically available at `/your-route`

### Add a New API Endpoint

1. Create controller: `server/src/controllers/yourController.ts`
2. Create route: `server/src/routes/yourRoutes.ts`
3. Register in: `server/src/routes/index.ts`
4. Call backend in frontend using `useApi` hook

### Add Gemini AI Analysis

1. Create service: `server/src/services/geminiAnalysis.ts`
2. Use `getGeminiModel()` from `config/gemini.ts`
3. Create endpoint in controller
4. Call from frontend

### Add MongoDB Model

1. Create schema: `server/src/models/YourModel.ts`
2. Use in service for database queries
3. Reference in controllers

---

## Best Practices

### Frontend
- ✅ Use functional components with hooks
- ✅ Extract logic into custom hooks
- ✅ Use Tailwind classes for styling (no separate CSS files)
- ✅ Keep components small and focused
- ✅ Use proper TypeScript types

### Backend
- ✅ Separate concerns (routes, controllers, services, models)
- ✅ Validate all inputs in middleware
- ✅ Use try-catch with proper error handling
- ✅ Add TypeScript types everywhere
- ✅ Document complex functions

### General
- ✅ Follow naming conventions (camelCase for variables, PascalCase for components)
- ✅ Commit frequently with meaningful messages
- ✅ Test locally before pushing
- ✅ Keep files under 300 lines (split if larger)
- ✅ Write comments for non-obvious logic

---

## Folder Purposes Quick Reference

| Folder | Purpose |
|--------|---------|
| `client/app/` | Next.js pages and routing |
| `client/components/` | Reusable React components |
| `client/hooks/` | Custom hooks for logic reuse |
| `client/lib/` | API clients and utilities |
| `client/styles/` | Global CSS and Tailwind |
| `client/utils/` | Helper functions |
| `server/src/routes/` | API endpoint definitions |
| `server/src/controllers/` | Request handlers |
| `server/src/models/` | MongoDB schemas |
| `server/src/services/` | Business logic & AI integration |
| `server/src/middleware/` | Auth, validation, error handling |
| `server/src/config/` | DB and Gemini AI setup |
| `docs/` | All documentation |

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Make changes
# (edit files...)

# Test locally
npm run dev

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature description"

# Push to GitHub
git push origin feature/my-new-feature

# Create Pull Request on GitHub
```

### Commit Message Format

```
feat: add new feature
fix: fix bug in X
docs: update documentation
refactor: reorganize code structure
style: format code
test: add tests
chore: update dependencies
```

---

## Troubleshooting

### Port Already in Use

```bash
# Change port in .env
PORT=5001
```

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Restart server after fixing

### Gemini API Error

- Add `GEMINI_API_KEY` to `.env`
- Get key from: https://makersuite.google.com/app/apikey
- Restart server after adding key

### CORS Error

- Ensure `CORS_ORIGIN=http://localhost:3000` in `.env`
- Frontend runs on 3000, backend on 5000

### Module Not Found

```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

---

## Next Steps

1. ✅ You're reading this - Great!
2. 📖 Read `docs/SETUP.md` - Set up your dev environment
3. 🏗️ Read `docs/ARCHITECTURE.md` - Understand the design
4. 📚 Read `docs/API.md` - Learn about API structure
5. 💻 Start implementing features!

---

## Document Guide

| Document | Read When | Time |
|----------|-----------|------|
| **PROJECT_OVERVIEW.md** | Getting started | 5 min |
| **SETUP.md** | Setting up environment | 10 min |
| **ARCHITECTURE.md** | Understanding design | 10 min |
| **API.md** | Adding API endpoints | 5 min |
| **FOLDER_STRUCTURE.txt** | Detailed folder breakdown | 5 min |
| **README.md** | Project reference | 5 min |

---

## Team Notes

- **Project Name**: NagarSeva
- **Type**: AI Hackathon Project
- **Status**: Structure created, ready for implementation
- **Tech Stack**: Next.js, Express, MongoDB, Gemini AI
- **Language**: TypeScript
- **Time to Setup**: ~20 minutes

---

## Questions?

- Check the relevant documentation file
- Review the code comments
- Look at the folder structure
- Check troubleshooting section
- Ask the team!

---

**You're all set to start building NagarSeva! Happy coding! 🚀**

---

*Last Updated: January 2024*
