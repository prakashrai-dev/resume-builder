import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'; 
import React, { useState } from 'react'; 
import { useSelector } from 'react-redux'; 
import api from '../configs/api';
import { toast } from 'react-hot-toast';

const ProjectForm = ({ data, onChange }) => {
    // --- START: Added from ExperienceForm ---
    const { token } = useSelector(state => state.auth);
    const [generatingIndex, setGeneratingIndex] = useState(-1);
    // --- END: Added from ExperienceForm ---

    const addProject = () => {
        const newProject = {
            name: "",
            type: "",
            description: "",
        };
        onChange([...data, newProject]);
    };

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    };

    const updateProject = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

  
    const generateProjectDescription = async (index) => {
        setGeneratingIndex(index);
        const project = data[index];
        const prompt = `Enhance this project description "${project.description}" for a project named "${project.name}" of type "${project.type}".`;

        try {
            // NOTE: You might need to create a new API endpoint for enhancing project descriptions.
            const response = await api.post('/api/ai/enhance-project-desc', { userContent: prompt }, { headers: { Authorization: token } });
            updateProject(index, "description", response.data.enhancedContent);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to enhance description.");
        } finally {
            setGeneratingIndex(-1);
        }
    };
    // --- END: AI Description Generation Function ---

    return (
        <div>
            <div>
                <div className='flex items-center justify-between'>
                    <div>
                        <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900 '>Projects</h3>
                        <p className='text-sm text-gray-500'>Add your projects details</p>
                    </div>
                    <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors '>
                        <Plus className='size-4' /> Add Project
                    </button>
                </div>
            </div>

            <div className="space-y-4 mt-6">
                {data.map((project, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <div className='flex justify-between items-start'>
                            <h4>Project #{index + 1}</h4>
                            <button onClick={() => removeProject(index)}
                                className='text-red-500 hover:text-red-700 transition-colors'>
                                <Trash2 className="size-4" />
                            </button>
                        </div>

                        <div className='grid gap-3'>
                            <input value={project.name || ""} onChange={(e) => updateProject(index, "name", e.target.value)} type="text" placeholder='Project Name' className='px-3 py-2 text-sm rounded-lg' />
                            <input value={project.type || ""} onChange={(e) => updateProject(index, "type", e.target.value)} type="text" placeholder='Project Type' className='px-3 py-2 text-sm rounded-lg' />
                            
                            {/* --- START: Modified Description Textarea with AI Button --- */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Project Description</label>
                                    <button 
                                        onClick={() => generateProjectDescription(index)} 
                                        disabled={generatingIndex === index || !project.name || !project.type} 
                                        className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
                                    >
                                        {generatingIndex === index ? (
                                            <Loader2 className='w-3 h-3 animate-spin' />
                                        ) : (
                                            <Sparkles className='w-3 h-3' />
                                        )}
                                        Enhance with AI
                                    </button>
                                </div>
                                <textarea 
                                    rows={4} 
                                    value={project.description || ""} 
                                    onChange={(e) => updateProject(index, "description", e.target.value)} 
                                    placeholder='Describe your project...' 
                                    className='w-full px-3 py-2 text-sm rounded-lg resize-none' 
                                />
                            </div>
                            {/* --- END: Modified Description Textarea --- */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectForm;