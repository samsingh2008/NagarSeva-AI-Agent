# NagarSeva - AI Civic Grievance & Community Safety Platform

## Project Goal

Build an AI-powered civic grievance reporting platform that allows citizens to report civic issues using photos and GPS, automatically identifies the issue, routes it to the correct authority, tracks complaint status, generates safety insights, and provides a government performance dashboard.

---

# Tech Stack

Frontend
- Next.js 14
- TypeScript
- Tailwind CSS

Backend
- Node.js
- Express.js
- TypeScript

Database
- MongoDB Atlas
- Mongoose

AI
- Google Gemini API
- Gemini Vision

Maps
- Leaflet
- OpenStreetMap

Charts
- Recharts

Deployment
- Vercel (Frontend)
- Render (Backend)

Version Control
- GitHub

---

# Core Features

## Citizen

- Upload photo
- Auto GPS
- Optional description
- Submit complaint
- View complaint status

## AI Agent

- Detect issue from image
- Classify issue
- Determine severity
- Generate structured complaint
- Route complaint to correct authority

## Admin

- View complaints
- Update status
- Resolve complaints
- Dashboard
- Analytics

## Safety

- Heatmap
- Unsafe area analysis
- Safer route recommendation

---

# AI Agents

### Vision Agent

Input:
- Image

Output:
- Issue Type
- Confidence

---

### Severity Agent

Input:
- Issue Type

Output:
- Low
- Medium
- High

---

### Complaint Agent

Generates:

- Title
- Description
- Evidence Summary

---

### Routing Agent

Maps issue to:

- Electricity
- PWD
- Sanitation
- Police
- Municipality

---

### Analytics Agent

Generates:

- Ward performance
- Complaint trends
- Government responsiveness

---

# Database Collections

Complaint

- id
- image
- latitude
- longitude
- description
- aiCategory
- severity
- department
- status
- timestamps

---

# Development Rules

- Never modify unrelated files.
- Build one feature at a time.
- Keep code modular.
- Use TypeScript.
- Write reusable React components.
- Keep APIs RESTful.
- Use Tailwind for styling.
- Explain every new file created.

---

# Development Order

1. Project Setup ✅
2. Complaint Submission Page
3. Complaint API
4. MongoDB Integration
5. Gemini Vision Integration
6. Complaint Generation
7. Authority Routing
8. Complaint Tracking
9. Admin Dashboard
10. Heatmap
11. Route Recommendation
12. Escalation System
13. Final UI Polish
14. Deployment

---

# Important

Never regenerate the whole project.

Only implement the requested feature while keeping the existing project intact.