
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const TermTemplateManager = () => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([
    { ruleId: '', category: '', title: '', contentTemplate: '' }
  ]);

  const handleAddSection = () => {
    setSections([
      ...sections, 
      { ruleId: '', category: '', title: '', contentTemplate: '' }
    ]);
  };

  const handleSaveTemplate = async () => {
    if (!templateName) {
      toast.error("Please provide a template name");
      return;
    }

    // TODO: Implement Supabase insertion logic for term templates
    toast.success("Term Template created successfully");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Manage Term Templates</h2>
        
        <div className="mb-4">
          <label className="block mb-2">Template Name</label>
          <input 
            type="text" 
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter template name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description (Optional)</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter template description"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Template Sections</h3>
          {sections.map((section, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label>Rule ID</label>
                  <input 
                    type="text" 
                    value={section.ruleId}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[index].ruleId = e.target.value;
                      setSections(newSections);
                    }}
                    className="w-full border rounded p-2"
                    placeholder="e.g., 1.1"
                  />
                </div>
                <div>
                  <label>Category</label>
                  <input 
                    type="text" 
                    value={section.category}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[index].category = e.target.value;
                      setSections(newSections);
                    }}
                    className="w-full border rounded p-2"
                    placeholder="e.g., General"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label>Title</label>
                <input 
                  type="text" 
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[index].title = e.target.value;
                    setSections(newSections);
                  }}
                  className="w-full border rounded p-2"
                  placeholder="Enter section title"
                />
              </div>
              <div>
                <label>Content Template</label>
                <textarea 
                  value={section.contentTemplate}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[index].contentTemplate = e.target.value;
                    setSections(newSections);
                  }}
                  className="w-full border rounded p-2"
                  placeholder="Enter content template with placeholders like {{competition_name}}"
                  rows={4}
                />
              </div>
            </div>
          ))}
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={handleAddSection}
            >
              Add Section
            </Button>
            <Button 
              onClick={handleSaveTemplate}
            >
              Save Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

