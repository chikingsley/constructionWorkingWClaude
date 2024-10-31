from agency_swarm.tools import BaseTool
from pydantic import Field
import os
import json
from pathlib import Path
from datetime import datetime

class TemplateManager(BaseTool):
    """
    Tool for managing document templates in the construction documentation system.
    Handles template creation, updates, and retrieval.
    """
    
    action: str = Field(
        ..., 
        description="Action to perform: 'create', 'update', 'get', or 'list'"
    )
    template_name: str = Field(
        ..., 
        description="Name of the template"
    )
    template_content: str = Field(
        None, 
        description="Content of the template (required for create/update actions)"
    )
    template_type: str = Field(
        None,
        description="Type of template (e.g., 'specification', 'plan', 'estimate')"
    )

    def run(self):
        """Manage document templates"""
        try:
            # Create templates directory if it doesn't exist
            templates_dir = Path("document_templates")
            templates_dir.mkdir(exist_ok=True)
            
            # Create templates registry if it doesn't exist
            registry_file = templates_dir / "template_registry.json"
            if registry_file.exists():
                registry = json.loads(registry_file.read_text())
            else:
                registry = {}
            
            if self.action == "create":
                if not self.template_content or not self.template_type:
                    return {
                        "status": "error",
                        "message": "Template content and type are required for creation"
                    }
                
                # Create template metadata
                template_metadata = {
                    "name": self.template_name,
                    "type": self.template_type,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
                
                # Save template content
                template_file = templates_dir / f"{self.template_name}.txt"
                template_file.write_text(self.template_content)
                
                # Update registry
                registry[self.template_name] = template_metadata
                registry_file.write_text(json.dumps(registry, indent=2))
                
                return {
                    "status": "success",
                    "message": "Template created successfully",
                    "template": template_metadata
                }
                
            elif self.action == "update":
                if self.template_name not in registry:
                    return {
                        "status": "error",
                        "message": "Template not found"
                    }
                
                # Update template content
                template_file = templates_dir / f"{self.template_name}.txt"
                template_file.write_text(self.template_content)
                
                # Update registry
                registry[self.template_name]["updated_at"] = datetime.now().isoformat()
                registry_file.write_text(json.dumps(registry, indent=2))
                
                return {
                    "status": "success",
                    "message": "Template updated successfully",
                    "template": registry[self.template_name]
                }
                
            elif self.action == "get":
                if self.template_name not in registry:
                    return {
                        "status": "error",
                        "message": "Template not found"
                    }
                
                template_file = templates_dir / f"{self.template_name}.txt"
                content = template_file.read_text()
                
                return {
                    "status": "success",
                    "template": registry[self.template_name],
                    "content": content
                }
                
            elif self.action == "list":
                return {
                    "status": "success",
                    "templates": registry
                }
                
            else:
                return {
                    "status": "error",
                    "message": "Invalid action specified"
                }

        except Exception as e:
            return {
                "status": "error",
                "message": f"Template operation failed: {str(e)}"
            }

if __name__ == "__main__":
    # Test the tool
    template_manager = TemplateManager(
        action="create",
        template_name="commercial_spec",
        template_type="specification",
        template_content="# Commercial Building Specification Template\n\n## 1. General Information\n..."
    )
    result = template_manager.run()
    print(result)