# PBI Lifecycle Web Application - Architecture

## Application Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PBI Lifecycle Assistant                   │
│                      Web Application                         │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
              ┌──────────────┐    ┌────────────────┐
              │   FRONTEND   │    │    BACKEND     │
              │  (React)     │    │  (Node.js +    │
              │  Port 3000   │    │   Express)     │
              │              │    │  Port 3001     │
              └──────┬───────┘    └────────┬───────┘
                     │                    │
                 ┌───┴────────────────────┴───┐
                 │                            │
             UI Components           REST API Endpoints
             • PBIList             • GET /api/pbis
             • PBIForm             • POST /api/pbis
             • PBIDetail           • PUT /api/pbis/:id
                                   • POST /api/pbis/:id/refine
                                   • POST /api/pbis/:id/generate-docs
                                             │
                                             ▼
                                        ┌──────────────┐
                                        │  SQLite DB   │
                                        │ (Local File) │
                                        └──────────────┘
```

## Workflow

```
1. CREATE PBI
   User fills form → POST /api/pbis → Database

2. VIEW PBIS
   User clicks "PBIs" → GET /api/pbis → Display list

3. SELECT PBI
   Click on card → Show detail view

4. RUN REFINER
   Click "🔍 Run PBI Refiner" → POST /api/pbis/:id/refine
   → Mock agent runs → Display verdict, checklist, questions

5. GENERATE DOCS
   Click "📄 Generate Documentation" → POST /api/pbis/:id/generate-docs
   → Mock agent runs → Generate .md and .docx
   → Update status to "docs_generated"
   → Display result with PR link
```

## Components

### Frontend (React)
- **App.js** – Main app container, navigation, state management
- **PBIList.js** – Display all PBIs as cards
- **PBIForm.js** – Create new PBI form with dynamic acceptance criteria
- **PBIDetail.js** – View single PBI, run agents, display results

### Backend (Node.js)
- **server.js** – Express server, routes, middleware
- **db.js** – SQLite database operations
- **agents.js** – Agent integration (currently mock implementations)

## Running the Application

### Option 1: Run Both Servers at Once (Windows)
```bash
cd web-app
start.bat
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd web-app/server
npm install
npm start

# Terminal 2 - Frontend
cd web-app/client
npm install
npm start
```

Then open: http://localhost:3000

## Key Features

✅ **Create & Edit PBIs** – Full CRUD operations
✅ **PBI Refinement** – Check readiness against Definition of Ready
✅ **Documentation Generation** – Automatic .md and .docx creation
✅ **Status Tracking** – View PBI lifecycle progress
✅ **Mock Agents** – Ready for integration with real Copilot agents

## Next Steps for Production

1. **Connect Real Agents** – Replace mock functions in `server/agents.js`
2. **GitHub Integration** – Create actual PRs with generated documentation
3. **Authentication** – Add user auth and permissions
4. **Database Migration** – Move to PostgreSQL for scalability
5. **UI Enhancements** – Add dark mode, real-time updates, notifications

---

**Status:** ✅ Fully functional prototype
**Last Updated:** 2026-11-25
**Repository:** https://github.com/nielspv/pbi-lifecycle-demo
