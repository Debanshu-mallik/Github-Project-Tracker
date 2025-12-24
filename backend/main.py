from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime
from github_cli import get_repos, get_commits, get_repo_details
from utils import calculate_duration, commits_per_week
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/")
def root():
    return {
        "message": "Github Project Tracker API is running",
        "endpoints": ["/projects"]
    }



@app.get("/projects")
def list_projects():
    username = os.getenv("GITHUB_USERNAME")
    repos = get_repos(username)
    
    results = []
    
    for repo in repos:
        commits = get_commits(username, repo["name"])
        duration = calculate_duration(commits)
        
        
        if duration:
            results.append({
                "repository": repo["name"],
                "language": repo.get("language"),
                **duration
            })
            
    return results
    



@app.get("/projects/{repo_name}")
def project_details(repo_name: str):
    username = os.getenv("GITHUB_USERNAME")
    
    repo = get_repo_details(username, repo_name)
    commits = get_commits(username, repo_name)
    
    if not commits:
        return {"Repository": repo_name}
        
    
    dates = [
        datetime.fromisoformat(
            c["commit"]["author"]["date"].replace("Z", "+00:00")
        )
        for c in commits
    ]
    
    
    start = min(dates)
    end = max(dates)
    
    
    return {
        "repository": repo_name,
        "description": repo.get("description"),
        "language": repo.get("language"),
        "total_commits": len(commits),
        "start_date": start.date().isoformat(),
        "end_date": end.date().isoformat(),
        "last_commit": {
            "message": commits[0]["commit"]["message"],
            "author": commits[0]["commit"]["author"]["name"],
            "date": commits[0]["commit"]["author"]["date"]
        },
        "avg_commits_per_week": commits_per_week(
            commits, start, end
        )
    }