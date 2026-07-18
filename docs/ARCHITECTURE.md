# NagarSeva Architecture Documentation

## System Overview

NagarSeva is a full-stack AI-powered urban service management platform with a clear separation of concerns between frontend and backend.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer (Next.js)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ UI Components (React) + Tailwind CSS                     │   │
│  │ - Pages, Components, Hooks, Utilities                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTP/REST API (JSON)
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                     Backend Layer (Express)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes → Controllers → Services → Models                │   │
│  │ - API Endpoints, Business Logic, Data Access            │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ External Integrations                                    │   │
│  │ - MongoDB (Database) - Gemini AI (LLM)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture (Next.js)

### Directory Structure & Data Flow

```
Client Request → Route (page.tsx) → Components → Hooks (useApi) → Axios → API Call
     ↓
  Response → State Management → Re-render → UI Update
```

### Key Principles

1. **Server Components First** - Use Next.js server components by default
2. **Component Isolation** - Keep components focused and reusable
3. **Custom Hooks** - Extract logic into hooks for reusability
4. **Utility Functions** - Pure functions for data transformation
5. **Tailwind CSS** - Utility-first styling without CSS files

### Component Hierarchy

```
<RootLayout>
  ├── <Header />
  ├── <main>
  │   ├── <Page Route>
  │   │   ├── <FeatureComponent>
  │   │   │   ├── <SubComponent>
  │   │   │   └── <SubComponent>
  │   │   └── <FeatureComponent>
  │   └── <OtherPage>
  └── <Footer />
```

## Backend Architecture (Express)

### Request/Response Flow

```
HTTP Request
     ↓
Middleware (CORS, Auth, Validation)
     ↓
Router (Route Matching)
     ↓
Controller (Request Handling)
     ↓
Service (Business Logic)
     ↓
Model (Data Access)
     ↓
Database / External API
     ↓
Response (JSON)
```

### Layer Responsibilities

#### Routes (`/src/routes`)
- Define API endpoints
- Map HTTP methods to controller actions
- Basic request validation

```typescript
// Example: userRoutes.ts
router.post('/users', validateUser, createUser);
router.get('/users/:id', getUser);
```

#### Controllers (`/src/controllers`)
- Handle HTTP requests and responses
- Call appropriate services
- Return formatted responses

```typescript
// Example: userController.ts
export const createUser = async (req, res) => {
  const userData = req.body;
  const user = await userService.create(userData);
  res.json({ success: true, data: user });
};
```

#### Services (`/src/services`)
- Contain business logic
- Interact with models and external APIs
- Reusable across multiple controllers

```typescript
// Example: userService.ts
export const create = async (userData) => {
  // Validation
  // Process data
  // Call model
  // Return result
};
```

#### Models (`/src/models`)
- Define MongoDB schemas
- Document structure and validation
- Database operations

```typescript
// Example: User.ts
const userSchema = new Schema({
  name: String,
  email: String,
  // ...
});

export default mongoose.model('User', userSchema);
```

### Middleware Strategy

1. **Global Middleware**
   - CORS configuration
   - Request logging
   - Error handling

2. **Route-Specific Middleware**
   - Authentication checks
   - Authorization validation
   - Request body validation

3. **Error Handling**
   - Centralized error handler
   - Consistent error response format

## Gemini AI Integration

### Service Architecture

```
Request from Client
     ↓
Controller receives request
     ↓
Service.analyzeWithGemini()
     ↓
  - Prepare prompt
  - Call Gemini API
  - Parse response
  - Return structured data
     ↓
Controller formats response
     ↓
Send to Client
```

### Example Service Pattern

```typescript
// services/geminiService.ts
export const analyzeIssue = async (issueDescription: string) => {
  const model = getGeminiModel();
  
  const prompt = `Analyze this urban issue: ${issueDescription}`;
  const response = await model.generateContent(prompt);
  
  return parseResponse(response);
};
```

## Data Model

### Core Collections (MongoDB)

- **Users** - User accounts and profiles
- **Issues** - Urban service issues/complaints
- **Reports** - Analysis reports generated by AI
- **Resolutions** - Proposed solutions and tracking

### Schema Design Principles

1. **Normalization** - Avoid data duplication
2. **Denormalization** - Optimize for read performance
3. **Indexes** - Index frequently queried fields
4. **Validation** - Schema-level data validation

## API Design

### RESTful Principles

```
GET    /api/v1/issues          - List all issues
GET    /api/v1/issues/:id      - Get specific issue
POST   /api/v1/issues          - Create new issue
PUT    /api/v1/issues/:id      - Update issue
DELETE /api/v1/issues/:id      - Delete issue
```

### Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "error": null
}
```

## Authentication & Security (Future)

- JWT tokens for stateless authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Input sanitization
- SQL injection prevention (MongoDB injection prevention)

## Performance Considerations

1. **Frontend**
   - Code splitting with Next.js
   - Image optimization
   - Lazy loading components
   - Caching strategies

2. **Backend**
   - Database indexing
   - Query optimization
   - Response pagination
   - Caching with Redis (optional)

3. **API Communication**
   - Minimize payload size
   - Implement pagination
   - Use compression

## Deployment

### Frontend (Next.js)
- Build: `npm run build`
- Deploy to: Vercel, Netlify, or any Node.js hosting

### Backend (Express)
- Build: `npm run build`
- Deploy to: Heroku, AWS, DigitalOcean, or any Node.js hosting

### Database
- MongoDB Atlas (Cloud) or self-hosted

## Environment Configuration

```
Development  → Local MongoDB, Gemini Test Key
Staging      → Staging MongoDB, Production Gemini Key
Production   → Production MongoDB, Production Gemini Key
```

## Monitoring & Logging

- Centralized logging (optional: Winston, Pino)
- Error tracking (optional: Sentry)
- Performance monitoring (optional: New Relic)

---

This architecture is designed to be scalable, maintainable, and follows industry best practices for full-stack development.
