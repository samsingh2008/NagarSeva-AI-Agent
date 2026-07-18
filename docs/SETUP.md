# NagarSeva Setup Guide

Complete step-by-step instructions to set up the NagarSeva project locally.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (local or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community) or [Cloud](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended - [Download](https://code.visualstudio.com/)

### Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v8+
git --version     # Any recent version
```

## Step 1: Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API key"
3. Copy the generated API key
4. **Keep it safe** - you'll need it in Step 3

## Step 2: Set Up MongoDB

### Option A: Local MongoDB

```bash
# On Windows (using Chocolatey)
choco install mongodb-community

# Or download from: https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod
```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier available)
4. Create a database user with username and password
5. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/nagarseva?retryWrites=true`)
6. Copy the connection string for Step 3

## Step 3: Clone & Setup Project

### Clone the Repository

```bash
# If cloning from GitHub (replace with your repo URL)
git clone <your-repo-url> NagarSeva
cd NagarSeva
```

### Create Environment File

```bash
# At project root (NagarSeva/)
cp .env.example .env
```

### Edit `.env` File

Open `.env` in your editor and fill in:

```bash
# Client
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nagarseva    # Or your MongoDB Atlas URI
NODE_ENV=development
GEMINI_API_KEY=your_api_key_from_step_1            # Paste your Gemini API key here
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000
```

**Example with MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nagarseva?retryWrites=true&w=majority
```

## Step 4: Install Dependencies

### Install Root Dependencies

```bash
cd NagarSeva/
npm install
```

### Install Client Dependencies

```bash
cd client/
npm install
```

### Install Server Dependencies

```bash
cd ../server/
npm install
```

## Step 5: Verify Setup

### Check Installations

```bash
# From root directory, check if all packages are installed
npm ls --depth=0

# Or verify individually
cd client && npm list react
cd ../server && npm list express
```

## Step 6: Run the Project

### Option A: Run Both Client & Server Together (Recommended)

```bash
# From root directory
npm run dev

# This will start:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000/health (health check)
```

### Option B: Run Separately

**Terminal 1 - Frontend:**
```bash
cd client/
npm run dev
# Opens http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd server/
npm run dev
# Runs on http://localhost:5000
```

### Verify Everything Works

1. **Frontend** - Open http://localhost:3000
   - You should see the NagarSeva homepage

2. **Backend Health Check** - Open http://localhost:5000/health
   - You should see: `{"message":"Server is running"}`

3. **Check Console Logs**
   - Frontend should show: "✓ Compiled client successfully"
   - Backend should show: "Server running on port 5000" and "✓ MongoDB connected successfully"

## Step 7: Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseError: Cannot connect to MongoDB`

**Solutions:**
- Ensure MongoDB service is running (`mongod` for local)
- Check `MONGODB_URI` in `.env` is correct
- Verify MongoDB credentials (for Atlas)
- Check network connection

### CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Ensure `CORS_ORIGIN=http://localhost:3000` in server `.env`
- Backend should be running on port 5000
- Frontend should be running on port 3000

### Gemini API Error

**Error:** `GEMINI_API_KEY not found`

**Solutions:**
- Add `GEMINI_API_KEY` to `.env` file
- Restart the server after adding the key
- Verify key is valid in [Google AI Studio](https://makersuite.google.com/app/apikey)

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
```bash
# Kill process on port 3000 (Frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solutions:**
- Ensure you ran `npm install` in both client and server
- Delete `node_modules` and `package-lock.json`, then reinstall
```bash
rm -r node_modules package-lock.json
npm install
```

## Step 8: Development Workflow

### Creating a New Feature

1. Create a branch
```bash
git checkout -b feature/your-feature-name
```

2. Make changes to client/server

3. Test locally
```bash
npm run dev
```

4. Commit
```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

### Useful Commands

```bash
# Root directory commands
npm run dev              # Run both client and server
npm run build            # Build for production
npm start                # Start production servers

# Client commands (from client/)
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Lint code

# Server commands (from server/)
npm run dev              # Start with auto-reload
npm run build            # Compile TypeScript
npm start                # Start compiled server
npm run lint             # Lint code
```

## Step 9: VS Code Extensions (Optional but Recommended)

- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **MongoDB for VS Code** - MongoDB.mongodb-vscode
- **Thunder Client** or **REST Client** - For API testing
- **Prettier** - esbenp.prettier-vscode

## Step 10: Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the codebase structure
2. Check [API.md](./API.md) for API endpoint documentation (to be created)
3. Start implementing features!

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**All set! You're ready to start developing NagarSeva! 🚀**

Need help? Check the troubleshooting section or create an issue in the repository.
