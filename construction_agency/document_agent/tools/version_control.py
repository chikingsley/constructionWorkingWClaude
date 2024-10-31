from agency_swarm.tools import BaseTool
from pydantic import Field
import os
import json
from datetime import datetime
from pathlib import Path

class VersionControl(BaseTool):
    """
    Tool for managing document versions and tracking changes in construction documentation.
    Implements version control with metadata tracking and change history.
    """
    
    document_id: str = Field(
        ..., 
        description="Unique identifier of the document"
    )
    content: str = Field(
        ..., 
        description="Current content of the document"
    )
    change_description: str = Field(
        ..., 
        description="Description of changes made in this version"
    )

    def run(self):
        """Manage document versioning and track changes"""
        try:
            # Create versions directory if it doesn't exist
            versions_dir = Path("document_versions")
            versions_dir.mkdir(exist_ok=True)
            
            # Create document directory
            doc_dir = versions_dir / self.document_id
            doc_dir.mkdir(exist_ok=True)
            
            # Get current timestamp
            timestamp = datetime.now().isoformat()
            
            # Create version metadata
            version_metadata = {
                "version_id": timestamp,
                "change_description": self.change_description,
                "timestamp": timestamp,
                "document_id": self.document_id
            }
            
            # Save content
            content_file = doc_dir / f"v_{timestamp}.txt"
            content_file.write_text(self.content)
            
            # Update version history
            history_file = doc_dir / "version_history.json"
            if history_file.exists():
                history = json.loads(history_file.read_text())
            else:
                history = []
                
            history.append(version_metadata)
            history_file.write_text(json.dumps(history, indent=2))
            
            return {
                "status": "success",
                "version_id": timestamp,
                "document_id": self.document_id,
                "message": "Version saved successfully"
            }

        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to save version: {str(e)}"
            }

if __name__ == "__main__":
    # Test the tool
    version_control = VersionControl(
        document_id="DOC001",
        content="Sample document content for testing",
        change_description="Initial version"
    )
    result = version_control.run()
    print(result)