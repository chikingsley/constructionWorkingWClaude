from agency_swarm import Agent
from .tools.technical_validator import TechnicalValidator
from .tools.timeline_analyzer import TimelineAnalyzer
from .tools.specification_checker import SpecificationChecker

class TechnicalAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Technical Validation Agent",
            description="Specialized in validating technical aspects of construction documentation",
            instructions="./instructions.md",
            tools=[
                TechnicalValidator,
                TimelineAnalyzer,
                SpecificationChecker
            ],
            temperature=0.5,
            max_prompt_tokens=4000
        )