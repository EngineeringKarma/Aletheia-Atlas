# Atlas AI Command Center - Full-Stack Template

A production-ready template for building modern, AI-first web applications with Python/FastAPI backend, Next.js/React frontend, Keycloak for identity management, and integrated AI features (Gemini).

---

## 🚨 For New Client Projects - Read This First!

When starting a new project from this template, understand what's real functionality vs demo/placeholder:

### What's Real (Production-Ready)

| Component | Description |
|-----------|-------------|
| **Authentication** | Credentials-based login with NextAuth.js; optional OAuth2/OIDC with Keycloak |
| **Authorization Engine** | JSON-based RBAC via `authz.map.json` and `authz.py` |
| **User Registration** | Self-registration with domain-based auto-approval or admin approval |
| **Admin User Management** | `/admin/users` - Approve/reject pending users |
| **Audit Logging** | `/admin/audit` - Automatic request logging + custom events with export |
| **AI Policies** | `/ai/policies` - Natural language rule engine with DSL translation |
| **AI Insights** | `/ai/insights` - Proactive analysis and recommendations |
| **AI Manager** | Global chatbot modal - Agentic assistant with tool execution |
| **Aletheia AI Assistant** | Student productivity assistant with analysis, planning, and chat |
| **Database Setup** | PostgreSQL with Alembic migrations |
| **API Structure** | FastAPI with dependency injection |
| **Session Management** | NextAuth.js with JWT token handling |
| **Agents & Telemetry** | Agent registry and telemetry API endpoints |

### What's Demo (Replace for Production)

| Page | Location | Action Required |
|------|----------|-----------------|
| **Dashboard** | `/` (page.tsx) | Replace mock stats with real data |
| **Settings** | `/settings` | Implement real settings functionality |
| **AI Manager tools** | Backend `services/ai/tools.py` | Wire to real system APIs |

---

## ✨ Core Features

- **Production-Ready Stack**: FastAPI, Next.js, PostgreSQL, and Keycloak (optional)
- **AI Integration**: Policies, Insights, and AI Manager with Gemini
- **Aletheia AI Assistant**: Student productivity companion with analysis, planning, and chat
- **Pluggable Authorization Engine**: Endpoint-level access control in JSON
- **User Self-Registration**: With domain-based auto-approval or admin approval
- **Comprehensive Audit Logging**: Automatic request logging + custom business events
- **Fully Containerized**: Docker and Docker Compose
- **Cloud-Ready**: Structure supports deployment to Google Cloud Run with Cloud SQL

---

## 💻 Technology Stack

| Area | Technology | Purpose |
|------|------------|---------|
| Backend | Python 3.11 + FastAPI | High-performance API |
| Frontend | Next.js 14+ + React + TypeScript | Modern UI framework |
| AI | Gemini API | Policies, Insights, Chatbot |
| Aletheia AI | Groq/Gemini API | Student productivity assistant |
| Identity | Keycloak 24 (optional) | Centralized IAM; local JWT also supported |
| Database | PostgreSQL 15 | Application data |
| DevOps | Docker + Docker Compose | Containerization |

---

## 🚀 Quick Start

Get the Atlas AI Command Center running locally in under 5 minutes.

### Prerequisites

| Tool | Required | Purpose |
|------|----------|---------|
| Docker Desktop | ✅ Yes | Runs all services |
| make | ✅ Yes | Dev commands (built-in on macOS/Linux; use WSL or Git Bash on Windows) |
| Google Cloud SDK | ❌ Optional | For cloud deployment |

### Step 1: Clone & Setup

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo

# Create your environment file
cp .env.example .env