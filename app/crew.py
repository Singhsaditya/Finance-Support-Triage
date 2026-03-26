from crewai import Crew
from .agents import get_agents
from .tasks import get_tasks

def run_crew(query: str):
    agents = get_agents()
    tasks = get_tasks(agents, query)

    crew = Crew(
        agents=list(agents),
        tasks=tasks,
        verbose=True
    )

    result = crew.kickoff()
    return result