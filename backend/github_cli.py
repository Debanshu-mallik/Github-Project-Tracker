import requests
import os


GITHUB_API= "https://api.github.com"

def get_headers():
    token = os.getenv("GITHUB_TOKEN")
    return {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    

def get_repos(username): 
    url = f"{GITHUB_API}/users/{username}/repos"
    response = requests.get(url, headers=get_headers())
    response.raise_for_status()
    return response.json()
    

def get_commits(owner, repo):
    url = f"{GITHUB_API}/repos/{owner}/{repo}/commits"
    response = requests.get(url, headers=get_headers())
    response.raise_for_status()
    return response.json()