from agency_swarm import Agent
from .tools.compliance_checker import ComplianceChecker
from .tools.permit_manager import PermitManager
from .tools.regulation_tracker import RegulationTracker

class ComplianceAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Compliance Agent",
            description="Specialized in ensuring regulatory compliance of construction documentation",
            instructions="./instructions.md",
            tools=[
                ComplianceChecker,
                PermitManager,
                RegulationTracker
            ],
            temperature=0.3,
            max_prompt_tokens=4000
        )