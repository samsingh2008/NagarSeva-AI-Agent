# 🚀 NagarSeva - Quick Start Guide (5 Minutes)

## What is NagarSeva?

An **AI-powered urban service management platform** that uses Google Gemini AI to help cities manage and resolve public issues.

---

## ⚡ Quick Setup (First Time)

### Step 1: Get API Keys (2 min)
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and save it

### Step 2: Create .env File (1 min)
At project root, create `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nagarseva
NODE_ENV=development
GEMINI_API_KEY=YOUR_KEY_HERE
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Install & Run (2 min)
```bash
# Install all dependencies
npm install

# Start both frontend and backend
npm run dev
```

✅ **Done!** Your project is running:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/health

---

## 📁 Project Structure (30 seconds)

```
NagarSeva/
├── client/          ← Frontend (React + Next.js)
│   ├── app/        ← Pages
│   ├── components/ ← UI Components
│   ├── hooks/      ← Custom logic
│   └── utils/      ← Helpers
│
├── server/         ← Backend (Express + Node.js)
│   └── src/
│       ├── routes/       ← API endpoints
│       ├── controllers/  ← Handlers
│       ├── services/     ← Business logic
│       └── models/       ← Database schemas
│
└── docs/           ← Documentation
```

---

## 🎯 Common Commands

```bash
# Start development (both client & server)
npm run dev

# Start only frontend
npm run dev:client

# Start only backend
npm run dev:server

# Build for production
npm run build

# Start production servers
npm start
```

---

## 💡 How to Develop

### Add a Frontend Page
```bash
# Create: client/app/(routes)/my-page/page.tsx
# It's automatically available at: /my-page
```

### Add a Backend API Endpoint
1. Create controller: `server/src/controllers/myController.ts`
2. Create route: `server/src/routes/myRoutes.ts`
3. Register in: `server/src/routes/index.ts`
4. Restart server

### Use Gemini AI
```typescript
// In server/src/services/myService.ts
import { getGeminiModel } from '@/config/gemini';

const model = getGeminiModel();
const response = await model.generateContent('Your prompt here');
```

---

## 🔑 Key Technologies

| What | Technology |
|------|-----------|
| Frontend | Next.js 14 + React |
| Styling | Tailwind CSS |
| Backend | Express.js |
| Database | MongoDB |
| AI | Google Gemini |
| Language | TypeScript |

---

## 📚 Full Documentation

1. **PROJECT_OVERVIEW.md** - Detailed overview (start here!)
2. **docs/SETUP.md** - Full setup instructions
3. **docs/ARCHITECTURE.md** - Design patterns & flow
4. **docs/API.md** - API endpoint reference
5. **docs/FOLDER_STRUCTURE.txt** - Every folder explained

---

## ⚠️ Troubleshooting

### Port in use?
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB error?
- Install MongoDB from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas

### CORS error?
- Restart backend after adding `.env` file

### Module not found?
```bash
rm -r node_modules package-lock.json
npm install
```

---

## 🎓 Learning Path

1. ✅ Run `npm run dev` (verify everything works)
2. 📖 Read `PROJECT_OVERVIEW.md` (understand structure)
3. 🏗️ Read `docs/ARCHITECTURE.md` (understand patterns)
4. 💻 Create a simple frontend component
5. 🔌 Create a simple backend API endpoint
6. 🤖 Integrate Gemini AI for something cool

---

## 📞 Need Help?

1. Check the **docs/** folder
2. Check **PROJECT_OVERVIEW.md** → Troubleshooting section
3. Read **docs/SETUP.md** → Troubleshooting section

---

## ✨ Project Status

- ✅ Folder structure created
- ✅ Configuration files set up
- ✅ Entry points initialized
- ✅ Documentation written
- ⏳ Ready for feature implementation!

---

**Ready to build? Start with `npm run dev` 🚀**

---

*Next: Read `PROJECT_OVERVIEW.md` for complete details*
