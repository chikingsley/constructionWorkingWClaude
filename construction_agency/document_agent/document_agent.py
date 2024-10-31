from agency_swarm import Agent
from .tools.document_generator import DocumentGenerator
from .tools.version_control import VersionControl
from .tools.template_manager import TemplateManager

class DocumentAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Document Creation Agent",
            description="Specialized in creating and managing construction documentation",
            instructions="./instructions.md",
            tools=[
                DocumentGenerator,
                VersionControl,
                TemplateManager
            ],
            temperature=0.7,
            max_prompt_tokens=4000
        )