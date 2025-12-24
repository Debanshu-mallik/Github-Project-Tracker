# GitHub Project Tracker

An interactive full-stack dashboard that integrates with the GitHub API to
analyze repository timelines, commit history, and project duration metrics.

## Features

- GitHub API integration using Personal Access Token
- Project duration analysis (start date, end date, days taken)
- Automatic project status classification (Active / In Progress / Stale)
- Interactive dashboard with:
  - Sortable table
  - Live search
  - Multi-dimensional filters (status, duration, language)
  - Visual progress indicators
- Drill-down repository details:
  - Description
  - Primary language
  - Commit statistics
  - Last commit information

## Tech Stack

### Backend
- Python
- FastAPI
- GitHub REST API

### Frontend
- HTML
- CSS
- Vanilla JavaScript

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app

Frontend

Open frontend/index.html in a browser.

Project Status

Actively evolving — next planned features include:

Project duration prediction

Timeline / Gantt visualization

Dockerized deployment
