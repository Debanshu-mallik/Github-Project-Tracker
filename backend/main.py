from fastapi import FastAPI
import os
from github_cli import get_repos, get_commits
from utils import calculate_duration
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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
                **duration
            })
            
    return results