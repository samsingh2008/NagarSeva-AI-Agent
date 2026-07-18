# NagarSeva API Documentation

Complete API reference for the NagarSeva backend service.

## Base URL

```
Development:  http://localhost:5000/api
Production:   https://api.nagarseva.com/api
```

## Authentication

*(To be implemented)*

- Header: `Authorization: Bearer <token>`
- Token obtained from login endpoint

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid auth |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "error": null
}
```

Error Response:
```json
{
  "success": false,
  "data": null,
  "message": "Operation failed",
  "error": "Detailed error message"
}
```

## Endpoints

### Health Check

#### GET /health

Check if server is running.

**Response:**
```json
{
  "message": "Server is running"
}
```

---

## Issues Endpoints

*(To be implemented)*

### List All Issues

#### GET /api/v1/issues

Get all issues with pagination.

**Query Parameters:**
- `page` (number) - Page number, default: 1
- `limit` (number) - Items per page, default: 10
- `status` (string) - Filter by status: open, in-progress, resolved

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f5a8b2c1d2e3f4a5b6c7d8",
      "title": "Pothole on Main Street",
      "description": "Large pothole affecting traffic",
      "location": "Main Street, Downtown",
      "status": "open",
      "priority": "high",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

---

### Create New Issue

#### POST /api/v1/issues

Create a new issue report.

**Request Body:**
```json
{
  "title": "Broken Street Light",
  "description": "Street light not working for a week",
  "location": "Park Avenue",
  "category": "lighting",
  "priority": "medium",
  "images": ["base64_image_string_1", "base64_image_string_2"]
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "64f5a8b2c1d2e3f4a5b6c7d8",
    "title": "Broken Street Light",
    "description": "Street light not working for a week",
    "location": "Park Avenue",
    "category": "lighting",
    "priority": "medium",
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Issue Details

#### GET /api/v1/issues/:id

Get details of a specific issue.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f5a8b2c1d2e3f4a5b6c7d8",
    "title": "Broken Street Light",
    "description": "Street light not working for a week",
    "location": "Park Avenue",
    "category": "lighting",
    "priority": "medium",
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update Issue

#### PUT /api/v1/issues/:id

Update an existing issue.

**Request Body:**
```json
{
  "status": "in-progress",
  "priority": "high",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f5a8b2c1d2e3f4a5b6c7d8",
    "title": "Broken Street Light",
    "status": "in-progress",
    "priority": "high",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### Delete Issue

#### DELETE /api/v1/issues/:id

Delete an issue.

**Response:**
```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

---

## AI Analysis Endpoints

*(To be implemented)*

### Analyze Issue with Gemini

#### POST /api/v1/ai/analyze

Get AI analysis of an issue using Gemini AI.

**Request Body:**
```json
{
  "issueId": "64f5a8b2c1d2e3f4a5b6c7d8",
  "description": "Pothole affecting traffic"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": "This is a critical infrastructure issue...",
    "severity": "high",
    "suggestedActions": ["Fill pothole immediately", "Inspect nearby roads"],
    "estimatedResolutionTime": "3-5 days",
    "requiredResources": ["road repair equipment", "materials"]
  }
}
```

---

### Generate Resolution Report

#### POST /api/v1/ai/generate-report

Generate a comprehensive resolution report using AI.

**Request Body:**
```json
{
  "issueId": "64f5a8b2c1d2e3f4a5b6c7d8"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "64f5a8b2c1d2e3f4a5b6c7d9",
    "issue": { /* issue details */ },
    "aiAnalysis": { /* analysis from Gemini */ },
    "actionPlan": "Step-by-step plan...",
    "timeline": "2 weeks",
    "budget": "$5000",
    "generatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## Error Examples

### Invalid Request (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Title is required"
}
```

### Resource Not Found (404)

```json
{
  "success": false,
  "message": "Issue not found",
  "error": "No issue with ID: 64f5a8b2c1d2e3f4a5b6c7d8"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

---

## Rate Limiting

*(To be implemented)*

- 100 requests per minute per IP
- 10 requests per minute for /ai/* endpoints

---

## Pagination

All list endpoints support pagination:

```
GET /api/v1/issues?page=2&limit=20
```

Response includes:
```json
{
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Filtering & Sorting

*(Examples for when implemented)*

```
GET /api/v1/issues?status=open&priority=high&sort=-createdAt
```

---

## Webhook Events

*(To be implemented)*

Subscribe to issue updates via webhooks.

---

## SDK/Client Libraries

*(To be implemented)*

- JavaScript/TypeScript SDK
- Python SDK

---

## Version History

| Version | Release Date | Changes |
|---------|--------------|---------|
| v1.0.0  | TBD          | Initial release |

---

## Testing

### Using cURL

```bash
# Health check
curl http://localhost:5000/health

# List issues
curl http://localhost:5000/api/v1/issues

# Create issue
curl -X POST http://localhost:5000/api/v1/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Issue",
    "description": "Test",
    "location": "Downtown",
    "category": "other",
    "priority": "medium"
  }'
```

### Using Thunder Client / Postman

1. Import API endpoints
2. Set `{{BASE_URL}}` to `http://localhost:5000/api`
3. Send requests

---

**Last Updated:** January 2024

For issues or questions, please refer to the main [README.md](../README.md) or contact the development team.
