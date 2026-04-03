from fastapi import APIRouter
from agent.agent import agent

router = APIRouter()

@router.get("/ask")
def ask(query: str):
    return agent(query)
