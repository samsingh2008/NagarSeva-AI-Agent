# 👋 START HERE - NagarSeva Setup

Welcome to **NagarSeva** - an AI-powered urban service management platform!

---

## ⏱️ You have 20 minutes to get started

Follow these steps in order:

---

## Step 1: Understand What You Have (2 min)

You have a **complete full-stack project structure** ready to build on:
- ✅ Frontend: Next.js + React + Tailwind CSS
- ✅ Backend: Express + MongoDB + Gemini AI
- ✅ Configuration: All setup, just need to fill in API keys
- ✅ Documentation: Everything is documented

**Key files:**
- `QUICKSTART.md` - 5-minute overview
- `PROJECT_OVERVIEW.md` - Detailed guide
- `docs/SETUP.md` - Full setup instructions

---

## Step 2: Get Your API Keys (3 min)

### Get Gemini API Key (FREE)
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Copy it (save somewhere safe)

### Get MongoDB (FREE Option)
Use MongoDB Atlas (cloud):
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string (looks like: `mongodb+srv://...`)

---

## Step 3: Create .env File (2 min)

At the project root (where you see this file), create a `.env` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

**Fill in:**
- `GEMINI_API_KEY` = Key from Step 2
- `MONGODB_URI` = MongoDB connection string from Step 2

---

## Step 4: Install Dependencies (5 min)

Open terminal/command prompt and run:

```bash
# Install everything
npm install

# This installs from root package.json
# (which installs client and server)
```

If that doesn't work, install manually:
```bash
npm install                  # Root dependencies
cd client && npm install     # Frontend dependencies
cd ../server && npm install  # Backend dependencies
cd ..                        # Go back to root
```

---

## Step 5: Start the Project (1 min)

```bash
npm run dev
```

This starts both frontend and backend automatically.

**You should see:**
- Frontend: http://localhost:3000 ✅
- Backend: Running on port 5000 ✅

**Verify it works:**
- Open http://localhost:3000 → Should see NagarSeva homepage
- Open http://localhost:5000/health → Should see JSON response

---

## 🎉 You're Done!

The project is running! Now what?

---

## 📖 Next: Read Documentation (in this order)

1. **QUICKSTART.md** (5 min)
   - Quick overview of the project

2. **PROJECT_OVERVIEW.md** (10 min)
   - Understand the structure & architecture

3. **docs/ARCHITECTURE.md** (10 min)
   - Learn how the code is organized
   - Understand the design patterns

4. **docs/SETUP.md** (reference)
   - Detailed setup instructions
   - Troubleshooting section

5. **docs/API.md** (reference)
   - API endpoint structure
   - How to create new endpoints

---

## 💻 Start Coding!

### Add a Frontend Page
```bash
# Create file: client/app/(routes)/dashboard/page.tsx
# Automatically available at: /dashboard
```

### Add a Backend Endpoint
1. Create controller: `server/src/controllers/yourController.ts`
2. Create route: `server/src/routes/yourRoutes.ts`
3. Register in: `server/src/routes/index.ts`
4. Restart server

### Use Gemini AI
```typescript
// In server/src/services/myService.ts
import { getGeminiModel } from '@/config/gemini';

const model = getGeminiModel();
const response = await model.generateContent('Your prompt');
```

---

## 🗂️ Important Folders

```
client/
  ├── app/        ← Pages go here
  ├── components/ ← React components
  ├── hooks/      ← Custom hooks
  └── utils/      ← Helper functions

server/src/
  ├── routes/     ← API endpoints
  ├── controllers/← Request handlers
  ├── services/   ← Business logic + Gemini AI
  ├── models/     ← MongoDB schemas
  └── config/     ← Database & AI setup
```

---

## ⚡ Common Commands

```bash
npm run dev              # Start both (frontend + backend)
npm run dev:client      # Start only frontend
npm run dev:server      # Start only backend
npm run build           # Build for production
npm start               # Run production servers
```

---

## ⚠️ Troubleshooting

### Something won't work?
1. Check `docs/SETUP.md` → Troubleshooting section
2. Make sure `.env` file exists with all values filled in
3. Make sure port 3000 and 5000 are free
4. Try: `rm -r node_modules` then `npm install` again

### Port already in use?
```bash
# Change PORT in .env to 5001
PORT=5001
```

### MongoDB error?
- Check `MONGODB_URI` in `.env` is correct
- Make sure MongoDB is running (or Atlas has your IP whitelisted)

### Gemini error?
- Check `GEMINI_API_KEY` in `.env`
- Make sure it's valid from Google AI Studio

---

## 📊 Project Status

✅ **Structure**: Complete
✅ **Configuration**: Complete
✅ **Documentation**: Complete
✅ **Ready for development**: YES

---

## 🎯 Your Hackathon Plan

1. ✅ Setup (you just did this!)
2. 🏗️ Create basic components & pages
3. 🔌 Create API endpoints
4. 🤖 Integrate Gemini AI for analysis
5. 🔗 Connect frontend to backend
6. ✨ Add cool features
7. 🚀 Deploy

---

## 📱 What is NagarSeva Building?

An AI-powered platform to help cities manage urban issues like:
- Potholes
- Broken street lights
- Waste management
- Traffic problems
- Public complaints

**How it works:**
1. Citizens report issues
2. Gemini AI analyzes them
3. System auto-assigns to departments
4. Real-time progress tracking
5. AI-generated solutions

---

## 🤔 Questions?

- **How do I structure my code?** → Read `docs/ARCHITECTURE.md`
- **How do I add an API endpoint?** → Read `docs/API.md`
- **Where do I put my components?** → Read `docs/FOLDER_STRUCTURE.txt`
- **I'm stuck on setup** → Read `docs/SETUP.md`
- **General questions** → Read `PROJECT_OVERVIEW.md`

---

## 🚀 Ready?

```bash
npm run dev
```

Then open http://localhost:3000 and start building! 🎉

---

## 📚 Files in This Project

- `QUICKSTART.md` - 5-minute overview
- `PROJECT_OVERVIEW.md` - Complete overview
- `STRUCTURE_CREATED.md` - What was created (this structure)
- `docs/SETUP.md` - Full setup guide
- `docs/ARCHITECTURE.md` - Design patterns
- `docs/API.md` - API reference
- `docs/FOLDER_STRUCTURE.txt` - Folder breakdown
- `README.md` - General reference

---

## ✨ Good luck with NagarSeva! 🌆

You have a professional, well-organized full-stack project structure.
The hard part (setup) is done. Now just build awesome features!

**Next:** Read `QUICKSTART.md` then start coding!

---

*Your AI-powered urban service management platform awaits!* 🚀✨
