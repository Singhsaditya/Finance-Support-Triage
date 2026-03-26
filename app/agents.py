from crewai import Agent
from .config import llm

def get_agents():
    classifier = Agent(
        role="Classifier",
        goal="Classify finance queries",
        backstory="Only classify. No extra explanation.",
        llm=llm,
        verbose=True
    )

    extractor = Agent(
        role="Extractor",
        goal="Extract financial data in JSON",
        backstory="Only extract structured data. No explanation.",
        llm=llm
    )

    decision = Agent(
        role="Decision Maker",
        goal="Determine risk and action",
        backstory="Only output JSON decisions.",
        llm=llm
    )

    validator = Agent(
        role="Validator",
        goal="Fix and validate JSON outputs",
        backstory="Strict validator. No extra text.",
        llm=llm
    )

    responder = Agent(
        role="Responder",
        goal="Generate final response",
        backstory="Professional finance assistant.",
        llm=llm
    )

    return classifier, extractor, decision, validator, responder