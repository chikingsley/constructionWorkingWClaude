from agency_swarm import Agency
from document_agent.document_agent import DocumentAgent
from technical_agent.technical_agent import TechnicalAgent
from compliance_agent.compliance_agent import ComplianceAgent
from cost_agent.cost_agent import CostAgent

# Initialize agents
doc_agent = DocumentAgent()
tech_agent = TechnicalAgent()
compliance_agent = ComplianceAgent()
cost_agent = CostAgent()

# Create agency with communication flows
agency = Agency(
    [
        doc_agent,  # Document agent is the entry point
        [doc_agent, tech_agent],  # Document agent can communicate with Technical agent
        [doc_agent, compliance_agent],  # Document agent can communicate with Compliance agent
        [doc_agent, cost_agent],  # Document agent can communicate with Cost agent
        [tech_agent, compliance_agent],  # Technical agent can communicate with Compliance agent
        [tech_agent, cost_agent],  # Technical agent can communicate with Cost agent
        [compliance_agent, cost_agent]  # Compliance agent can communicate with Cost agent
    ],
    shared_instructions="agency_manifesto.md",
    temperature=0.5,
    max_prompt_tokens=4000
)

if __name__ == "__main__":
    agency.run_demo()