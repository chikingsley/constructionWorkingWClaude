from agency_swarm.tools import BaseTool
from pydantic import Field
import os
from dotenv import load_dotenv
import anthropic

load_dotenv()

# Initialize Claude client
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class DocumentGenerator(BaseTool):
    """
    Tool for generating construction documents using Claude AI.
    Generates high-quality, structured documents based on project requirements and templates.
    """
    
    document_type: str = Field(
        ..., 
        description="Type of document to generate (e.g., 'specification', 'plan', 'estimate', 'schedule')"
    )
    project_details: str = Field(
        ..., 
        description="Key project details and requirements for document generation"
    )
    template_name: str = Field(
        ..., 
        description="Name of the template to use for document generation"
    )

    def run(self):
        """Generate a construction document using Claude AI"""
        try:
            # Create a structured prompt for Claude
            prompt = f"""Generate a detailed construction {self.document_type} document based on the following:

Project Details:
{self.project_details}

Template: {self.template_name}

Please provide a well-structured, professional document following construction industry standards.
Include all necessary sections, technical details, and formatting.
"""

            # Generate document using Claude
            message = client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=4096,
                temperature=0.7,
                system="You are an expert construction documentation specialist. Generate detailed, accurate, and properly formatted construction documents.",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            # Extract and format the generated content
            generated_content = message.content[0].text
            
            return {
                "status": "success",
                "content": generated_content,
                "document_type": self.document_type,
                "template": self.template_name
            }

        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to generate document: {str(e)}"
            }

if __name__ == "__main__":
    # Test the tool
    generator = DocumentGenerator(
        document_type="specification",
        project_details="3-story commercial building, 50,000 sq ft, modern design, LEED certification required",
        template_name="commercial_building_spec"
    )
    result = generator.run()
    print(result)