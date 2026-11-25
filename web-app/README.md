# PBI Lifecycle Web Application

A full-stack web application for managing the Product Backlog Item (PBI) lifecycle with AI-powered refinement and automatic documentation generation.

## Features

✅ **PBI Management** – Create, view, and manage PBIs through an intuitive web interface
✅ **AI-Powered Refinement** – Run the pbi-refiner agent to assess PBIs against Definition of Ready
✅ **Automatic Documentation** – Generate Markdown and .docx documentation from completed PBIs
✅ **Real-time Status Tracking** – View PBI status at every stage of the lifecycle
✅ **Test Evidence Integration** – Link implementation summaries and test results

## Tech Stack

- **Backend:** Node.js + Express + SQLite
- **Frontend:** React + Axios
- **Database:** SQLite (file-based)

## Project Structure

```
web-app/
├── server/              # Backend application
│   ├── server.js       # Express server
│   ├── db.js           # Database operations
│   ├── agents.js       # Agent integration (mock)
│   └── package.json
│
└── client/              # React frontend
    ├── public/         # Static files
    ├── src/
    │   ├── components/ # React components
    │   ├── App.js     # Main app component
    │   ├── index.js   # Entry point
    │   └── *.css      # Styling
    └── package.json
```

## Setup & Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ (for documentation generation)

### Backend Setup

```bash
cd web-app/server
npm install
npm start
```

The server will run on `http://localhost:3001`

### Frontend Setup

In a new terminal:

```bash
cd web-app/client
npm install
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### PBIs
- `GET /api/pbis` – Get all PBIs
- `GET /api/pbis/:id` – Get single PBI
- `POST /api/pbis` – Create new PBI
- `PUT /api/pbis/:id` – Update PBI
- `POST /api/pbis/:id/refine` – Run PBI Refiner agent
- `POST /api/pbis/:id/generate-docs` – Run Documentation Writer agent

## Usage

1. **Create a PBI** – Click "➕ Create PBI" and fill in the form
2. **Run Refiner** – Select a PBI and click "🔍 Run PBI Refiner" to check readiness
3. **Generate Docs** – Once refined, click "📄 Generate Documentation" to create Markdown and .docx files
4. **Track Status** – View the PBI status as it moves through the lifecycle

## Development

To enhance the application:

1. **Backend:** Modify `server/agents.js` to call real Copilot agents
2. **Frontend:** Add new components in `client/src/components/`
3. **Database:** Extend the schema in `server/db.js`

## Notes

- Database is stored locally as `pbi-lifecycle.db`
- The agents module currently uses mock implementations
- For production, integrate with actual GitHub Copilot agents

## License

MIT
