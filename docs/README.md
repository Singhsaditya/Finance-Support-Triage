# FinTriage — AI-Powered Finance Support Triage System

> Classify intent, detect urgency, extract financial entities, and draft AI responses — all in one automated pipeline.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Agent Pipeline](#agent-pipeline)
- [Frontend Pages](#frontend-pages)
- [Data Models](#data-models)
- [Configuration](#configuration)

---

## Overview

FinTriage is a full-stack AI triage system for finance support teams. When a customer sends a support message, FinTriage runs it through a multi-agent CrewAI pipeline that:

1. **Classifies** the intent (fraud, refund, payment issue, general)
2. **Extracts** structured financial data (amounts, dates, transaction IDs)
3. **Decides** the risk level and recommended action
4. **Validates** and merges all outputs into a clean JSON record
5. **Drafts** a professional response the support agent can review and send

Every query is persisted to MongoDB as a ticket, complete with all parsed fields and the AI-generated response, and surfaced through a React dashboard with real-time stats, filtering, and pagination.

---

## Features

| Feature | Description |
|---|---|
| **Intent Classification** | Categorizes queries as `fraud`, `refund`, `payment_issue`, or `general` |
| **Urgency Detection** | Assigns `high`, `medium`, or `low` urgency with a reason |
| **Entity Extraction** | Pulls amounts, dates, and transaction IDs from free-form text |
| **Risk Assessment** | Determines risk level and recommended action |
| **AI Response Drafts** | Generates a ready-to-send professional response |
| **Ticket Management** | Paginated ticket list with status, urgency, and category filters |
| **Live Dashboard** | Real-time stats showing total, high, medium, and low urgency counts |
| **Settings Panel** | Configurable API base URL and dark mode toggle |

---

## Architecture

```
Customer Message
      │
      ▼
┌─────────────────────────────────────────────────────┐
│                  FastAPI Backend                     │
│                                                     │
│  POST /api/v1/triage                                │
│        │                                            │
│        ▼                                            │
│  ┌─────────────────────────────────────────────┐   │
│  │            CrewAI Agent Pipeline            │   │
│  │                                             │   │
│  │  [Classifier] → [Extractor] → [Decision]   │   │
│  │       → [Validator] → [Responder]           │   │
│  └─────────────────────────────────────────────┘   │
│        │                                            │
│        ▼                                            │
│   MongoDB (tickets collection)                      │
│        │                                            │
│        ▼                                            │
│  GET /api/v1/tickets  ←──── React Frontend          │
│  GET /api/v1/tickets/:id                            │
│  GET /api/v1/stats                                  │
└─────────────────────────────────────────────────────┘
```

The backend is a **FastAPI** application that orchestrates a **CrewAI** multi-agent pipeline backed by **Google Gemini 2.5 Flash**. Results are stored in **MongoDB** and served to a **React + Vite** frontend.

---

## Tech Stack

### Backend
- **Python 3.10+**
- **FastAPI** — REST API framework
- **CrewAI** — Multi-agent orchestration
- **LangChain + Google Generative AI** — LLM integration (Gemini 2.5 Flash)
- **PyMongo** — MongoDB driver
- **python-dotenv** — Environment variable management

### Frontend
- **React 18** + **Vite**
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **Framer Motion** — Animations
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icon set

### Infrastructure
- **MongoDB** — Ticket persistence
- **Google AI Studio** — Gemini API access

---

## Project Structure

```
fintriage/
├── app/
│   ├── main.py          # FastAPI app, routes, CORS config
│   ├── agents.py        # CrewAI agent definitions
│   ├── tasks.py         # CrewAI task definitions
│   ├── crew.py          # Crew assembly and kickoff
│   ├── config.py        # LLM configuration (Gemini)
│   ├── database.py      # MongoDB connection and collection
│   ├── parser.py        # JSON extraction utility
│   └── schemas.py       # Pydantic request models
│
├── frontend/
│   └── src/
│       ├── App.jsx              # Root router
│       ├── main.jsx             # React entry point
│       ├── index.css            # Tailwind + custom styles
│       ├── services/
│       │   └── api.js           # Axios API client
│       ├── context/
│       │   └── SettingsContext.jsx  # Global settings (API URL, dark mode)
│       ├── components/
│       │   ├── Sidebar.jsx      # Navigation sidebar
│       │   ├── Navbar.jsx       # Top header bar
│       │   ├── StatCard.jsx     # Animated stat display card
│       │   ├── UrgencyBadge.jsx # Color-coded urgency indicator
│       │   ├── EntityTable.jsx  # Extracted entity display table
│       │   ├── ResponseEditor.jsx  # Editable AI response textarea
│       │   └── Spinner.jsx      # Loading spinner SVG
│       └── pages/
│           ├── Landing.jsx       # Marketing landing page
│           ├── DashboardLayout.jsx  # Shell with sidebar + navbar
│           ├── DashboardHome.jsx    # Stats + recent tickets overview
│           ├── TriageAnalyzer.jsx   # Main triage input and results UI
│           ├── Tickets.jsx          # Paginated ticket list with filters
│           └── Settings.jsx         # API URL + dark mode config
│
├── .env                 # Environment variables (not committed)
└── requirements.txt     # Python dependencies
```

---

## Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- MongoDB (local instance or MongoDB Atlas)
- A Google AI Studio API key ([get one here](https://aistudio.google.com/))

---

### Backend Setup

**1. Clone the repository and navigate to the root:**

```bash
git clone <repo-url>
cd fintriage
```

**2. Create and activate a virtual environment:**

```bash
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows
```

**3. Install Python dependencies:**

```bash
pip install fastapi uvicorn crewai langchain-google-genai pymongo python-dotenv
```

**4. Create your `.env` file** (see [Environment Variables](#environment-variables)).

**5. Start the backend server:**

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://127.0.0.1:8000`. Interactive docs are at `http://127.0.0.1:8000/docs`.

---

### Frontend Setup

**1. Navigate to the frontend directory:**

```bash
cd frontend
```

**2. Install Node dependencies:**

```bash
npm install
```

**3. Start the development server:**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Google AI Studio API key for Gemini access
GOOGLE_API_KEY=your_google_api_key_here

# MongoDB connection string
# Local:  mongodb://localhost:27017
# Atlas:  mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
MONGO_URI=mongodb://localhost:27017
```

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_API_KEY` | ✅ Yes | Google AI Studio key for Gemini 2.5 Flash |
| `MONGO_URI` | ✅ Yes | MongoDB connection string |

---

## API Reference

All endpoints are prefixed with `/api/v1`.

---

### `POST /api/v1/triage`

Submits a customer query through the full AI agent pipeline and creates a ticket.

**Request body:**

```json
{
  "query": "I was charged twice for my subscription on March 15th. I need a refund for the duplicate charge of $49.99."
}
```

**Response:**

```json
{
  "ticket_id": "6630a1b2c3d4e5f6a7b8c9d0",
  "status": "PROCESSING"
}
```

---

### `GET /api/v1/tickets`

Returns a paginated list of all tickets. Supports filtering by status, urgency, and category.

**Query parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `per_page` | integer | `10` | Results per page |
| `status` | string | — | Filter by status (`PROCESSING`, `RESOLVED`, `PENDING`) |
| `urgency` | string | — | Filter by urgency (`high`, `medium`, `low`) |
| `category` | string | — | Filter by intent category |

**Response:**

```json
{
  "tickets": [
    {
      "id": "6630a1b2c3d4e5f6a7b8c9d0",
      "query": "I was charged twice...",
      "status": "PROCESSING",
      "category": "refund",
      "urgency": "high",
      "risk_level": "medium",
      "amount": "49.99",
      "date": "2026-03-27T10:30:00.000000"
    }
  ],
  "total_pages": 5
}
```

---

### `GET /api/v1/tickets/{ticket_id}`

Returns full details for a single ticket, including all parsed fields and the AI response draft.

**Response:**

```json
{
  "id": "6630a1b2c3d4e5f6a7b8c9d0",
  "query": "I was charged twice...",
  "status": "PROCESSING",
  "parsed": {
    "category": "refund",
    "amount": "49.99",
    "date": "March 15th",
    "transaction_id": "",
    "risk_level": "medium",
    "urgency": "high",
    "urgency_reason": "Duplicate charge with specific amount mentioned",
    "action": "Initiate refund investigation immediately"
  },
  "ai_response": "Thank you for reaching out. We sincerely apologize for the duplicate charge...",
  "created_at": "2026-03-27T10:30:00.000000"
}
```

---

### `GET /api/v1/stats`

Returns aggregate counts for the dashboard stat cards.

**Response:**

```json
{
  "total": 142,
  "high": 23,
  "medium": 67,
  "low": 52
}
```

---

## Agent Pipeline

FinTriage uses five specialized CrewAI agents that run sequentially. Each agent receives the customer query and builds on the previous agent's output.

```
Query Input
    │
    ▼
┌──────────────┐
│  Classifier  │  → One-word category: fraud | refund | payment_issue | general
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Extractor   │  → JSON: { amount, date, transaction_id }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Decision   │  → JSON: { risk_level, urgency, urgency_reason, action }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Validator   │  → Merged JSON with all fields, errors corrected
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Responder   │  → Final professional response text
└──────────────┘
```

### Agent Descriptions

| Agent | Role | Output |
|---|---|---|
| **Classifier** | Reads the query and assigns a single intent category | One of: `fraud`, `refund`, `payment_issue`, `general` |
| **Extractor** | Pulls structured financial entities from the text | JSON with `amount`, `date`, `transaction_id` |
| **Decision Maker** | Evaluates risk and determines the appropriate action | JSON with `risk_level`, `urgency`, `urgency_reason`, `action` |
| **Validator** | Fixes any malformed JSON and merges all previous outputs | Single merged JSON object with all fields |
| **Responder** | Generates a polished customer-facing response | Professional plain text response |

All agents are powered by **Gemini 2.5 Flash** via LangChain's `ChatGoogleGenerativeAI` integration, configured with `temperature=0.2` for consistent, deterministic outputs.

---

## Frontend Pages

### Landing (`/`)
Marketing page with feature overview and call-to-action buttons linking to the dashboard and triage analyzer.

### Dashboard Home (`/dashboard`)
Overview page showing four stat cards (total, high, medium, low urgency counts) and a table of the five most recent tickets. Includes quick-action cards for running a new triage and browsing all tickets.

### Triage Analyzer (`/dashboard/triage`)
The main analysis interface. Paste any customer message and click **Run Triage** to submit. Results appear in the right panel showing:
- Intent classification
- Urgency level with reasoning
- Parsed financial fields
- Editable AI response draft with copy and regenerate controls

### Tickets (`/dashboard/tickets`)
Paginated table of all tickets with:
- Text search (by query content or ID)
- Filter by status (PROCESSING / RESOLVED / PENDING)
- Filter by urgency (high / medium / low)
- Click any row to open a full-detail modal with all parsed fields and the AI response

### Settings (`/dashboard/settings`)
Configure the backend API base URL (persisted to `localStorage`) and toggle dark mode.

---

## Data Models

### Ticket (MongoDB document)

```json
{
  "_id": "ObjectId",
  "query": "string — the original customer message",
  "parsed": {
    "category": "fraud | refund | payment_issue | general",
    "amount": "string — extracted monetary value",
    "date": "string — extracted date reference",
    "transaction_id": "string — extracted transaction ID",
    "risk_level": "string — e.g. low / medium / high",
    "urgency": "high | medium | low",
    "urgency_reason": "string — explanation for urgency level",
    "action": "string — recommended next action"
  },
  "response": "string — AI-generated response draft",
  "status": "PROCESSING | RESOLVED | PENDING",
  "created_at": "datetime (UTC)"
}
```

---

## Configuration

### Changing the LLM model

Edit `app/config.py`:

```python
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",   # change model here
    temperature=0.2,            # lower = more deterministic
    google_api_key=os.getenv("GOOGLE_API_KEY")
)
```

### Changing the MongoDB database or collection

Edit `app/database.py`:

```python
db = client["finance_ai"]        # database name
collection = db["tickets"]       # collection name
```

### Changing the frontend API URL

Either update the default in `frontend/src/services/api.js`:

```javascript
return localStorage.getItem('apiBase') || 'http://127.0.0.1:8000'
```

Or use the **Settings** page in the UI to change it at runtime — the value is persisted to `localStorage`.

### Allowed frontend origins

CORS is configured in `app/main.py`. To allow additional origins:

```python
allow_origins=["http://localhost:5173", "https://your-production-domain.com"]
```

---

## Notes

- The triage pipeline can take **15–60 seconds** per query depending on model latency — this is expected for a five-agent sequential workflow.
- All ticket statuses default to `PROCESSING` on creation. Status management (marking tickets as RESOLVED, etc.) can be added via a PATCH endpoint.
- The frontend's text search filter operates **client-side** on the current page of results. For full-text search across all tickets, consider adding a MongoDB text index and a backend search endpoint.
