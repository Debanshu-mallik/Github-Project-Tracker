from datetime import datetime

def calculate_duration(commits):
    if not commits:
        return none
        
    
    dates = [
        datetime.fromisoformat(
            commit["commit"]["author"]["date"].replace("Z", "+00:00")
        )
        for commit in commits
    ]
    
    
    start = min(dates)
    end = max(dates)
    
    
    return {
        "start_date": start.date().isoformat(),
        "end_date": end.date().isoformat(),
        "days_taken": (end - start).days + 1
        
    }


def commits_per_week(commits,start_date,end_date):
    if not commits:
        return 0
        
    
    days = (end_date - start_date).days +1
    weeks = max(days/7,1)
    return round(len(commits)/weeks,2)