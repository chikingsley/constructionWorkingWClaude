from agency_swarm import Agent
from .tools.cost_estimator import CostEstimator
from .tools.market_analyzer import MarketAnalyzer
from .tools.budget_manager import BudgetManager

class CostAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Cost Analysis Agent",
            description="Specialized in financial analysis and cost validation of construction projects",
            instructions="./instructions.md",
            tools=[
                CostEstimator,
                MarketAnalyzer,
                BudgetManager
            ],
            temperature=0.4,
            max_prompt_tokens=4000
        )