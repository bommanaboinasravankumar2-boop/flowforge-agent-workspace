# FlowForge AI 🚀

An open-source, production-ready AI Workflow Automation Platform similar to n8n.io, but featuring a modern visual node canvas, AI-first generative workers, and agentic no-code building blocks.

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-emerald.svg)]()
[![Platform: Fullstack](https://img.shields.io/badge/platform-fullstack-blue.svg)]()

---

## 🎨 Core Visuals & System Architecture

FlowForge AI uses a desktop-optimized, responsive glassmorphic dark interface designed to provide seamless drag-and-drop automation construction:

- **Infinite Canvas Workspace**: Fluid coordinate-system workspace supporting zooming (mouse wheel) and panning (drag background).
- **Dynamic Connection Portals**: Connect output sockets to target input ports with glowing curved SVG cables that actively animate to display pipeline loads.
- **Topological Execution Engine**: Running nodes pulse and glow in cyan/blue, succeeded nodes lock bright green, and execution exceptions halt nodes with neon red glows.
- **AI Workflow Agent**: Feed natural language inputs to the Google Gemini generator (e.g., *"Ingest webhook leads, record to Sheet, check sentiment with Gemini and log inside Notion database"*), and let the platform automatically forge and connect the layout.

---

## 🏗️ Repository Directory Layout

```text
flowforge-ai/
├── backend/                  # REST APIs, Express handlers & Gemini execution engine
├── frontend/                 # React 19, Tailwind CSS v4, Framer Motion
├── docker/                   # Dockerfiles & deployment recipes
├── .github/
│   └── workflows/            # GitHub Actions CI/CD workflows
├── README.md                 # Complete system documentation
├── LICENSE                   # MIT Open-Source License
├── docker-compose.yml        # Development Docker orchestration
└── package.json              # Unified monorepo scripts
```

---

## ⚙️ Environment Config Variables

Copy `.env.example` into a local `.env` and configure the secrets:

```env
# Server Ingress Inbound Port
PORT=3000

# Google Gemini API key used for executing Generative nodes & AI workflow forging
GEMINI_API_KEY="your-gemini-key"

# Database Configuration (PostgreSQL option)
DATABASE_URL="postgresql://user:pass@localhost:5432/flowforge"

# Secret variable encryptions key
ENCRYPTION_SECRET="vault-aes-key-256"
```

---

## ⚡ Quick-Start Installation

Ensure you have **Node.js v20+** installed locally.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/flowforge-ai.git
cd flowforge-ai
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the workspace.

### 3. Production Compilation & Startup
```bash
npm run build
npm start
```

---

## 🐳 Docker Deployment Setup

Deploy the complete full-stack environment with a PostgreSQL database and an in-memory Redis message broker in seconds:

```bash
docker-compose up --build -d
```

To deploy with production caching and optimized container layers:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🛡️ Enterprise API Specification

### 1. Workflows
- `GET /api/workflows`: Retrieve all saved pipeline definitions.
- `POST /api/workflows`: Save or update a workflow blueprint.
- `DELETE /api/workflows/:id`: Remove a workflow.

### 2. Execution Pipeline
- `POST /api/workflows/execute`: Start sequential validation runs. Parses parameters, resolves JavaScript code scripts, and triggers Gemini generative runs.
- `GET /api/logs`: Query last 100 system audit and execution logs.

### 3. Smart AI Generator
- `POST /api/workflows/generate-ai`: Ingests natural language prompts and queries Google Gemini to output topological nodes & connection links.

---

## 📄 License

This project is licensed under the terms of the [MIT License](LICENSE).
