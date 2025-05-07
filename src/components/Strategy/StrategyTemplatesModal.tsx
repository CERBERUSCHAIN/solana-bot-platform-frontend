// CERBERUS Bot - Strategy Templates Modal Component
// Created: 2025-05-06 21:59:40 UTC
// Author: CERBERUSCHAINYes

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStrategy } from '../../contexts/StrategyContext';
import { StrategyTemplate } from '../../types/strategy';

interface StrategyTemplatesModalProps {
  onClose: () => void;
}

export const StrategyTemplatesModal: React.FC<StrategyTemplatesModalProps> = ({ onClose }) => {
  const router = useRouter();
  const { loadTemplates, createFromTemplate, isLoading } = useStrategy();
  
  const [templates, setTemplates] = useState<StrategyTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<StrategyTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<StrategyTemplate | null>(null);
  const [strategyName, setStrategyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await loadTemplates();
        setTemplates(data);
        setFilteredTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };
    
    fetchTemplates();
  }, []);
  
  useEffect(() => {
    let filtered = [...templates];
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(template => template.category === activeCategory);
    }
    
    // Filter by difficulty
    if (activeDifficulty !== 'all') {
      filtered = filtered.filter(template => template.difficultyLevel === activeDifficulty);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(term) || 
        template.description.toLowerCase().includes(term) ||
        (template.tags && template.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    setFilteredTemplates(filtered);
  }, [templates, activeCategory, activeDifficulty, searchTerm]);
  
  const handleSelectTemplate = (template: StrategyTemplate) => {
    setSelectedTemplate(template);
    setStrategyName(`${template.name} Strategy`);
  };
  
  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) {
      setError('Please select a template first.');
      return;
    }
    
    if (!strategyName.trim()) {
      setError('Please provide a name for your strategy.');
      return;
    }
    
    setError(null);
    setIsCreating(true);
    
    try {
      const strategy = await createFromTemplate(selectedTemplate.id, strategyName);
      router.push(`/strategies/${strategy.id}`);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to create strategy from template.');
    } finally {
      setIsCreating(false);
    }
  };
  
  // Get unique categories from templates
  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-900 bg-opacity-20 text-green-400';
      case 'intermediate':
        return 'bg-yellow-900 bg-opacity-20 text-yellow-400';
      case 'advanced':
        return 'bg-red-900 bg-opacity-20 text-red-400';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full overflow-hidden flex flex-col h-4/5">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold">Strategy Templates</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Templates List */}
          <div className="w-2/3 flex flex-col border-r border-gray-700">
            {/* Filters */}
            <div className="p-4 border-b border-gray-700 flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
              />
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-2 py-1 text-xs rounded-md ${
                          category === activeCategory 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {category === 'all' ? 'All' : category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Difficulty</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveDifficulty('all')}
                      className={`px-2 py-1 text-xs rounded-md ${
                        activeDifficulty === 'all' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveDifficulty('beginner')}
                      className={`px-2 py-1 text-xs rounded-md ${
                        activeDifficulty === 'beginner' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Beginner
                    </button>
                    <button
                      onClick={() => setActiveDifficulty('intermediate')}
                      className={`px-2 py-1 text-xs rounded-md ${
                        activeDifficulty === 'intermediate' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Intermediate
                    </button>
                    <button
                      onClick={() => setActiveDifficulty('advanced')}
                      className={`px-2 py-1 text-xs rounded-md ${
                        activeDifficulty === 'advanced' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Advanced
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Templates List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-16 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredTemplates.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {filteredTemplates.map(template => (
                    <div
                      key={template.id}
                      className={`p-4 hover:bg-gray-750 transition-colors cursor-pointer ${
                        selectedTemplate?.id === template.id ? 'bg-gray-750 border-l-4 border-indigo-500' : ''
                      }`}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-white">{template.name}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(template.difficultyLevel)}`}>
                          {template.difficultyLevel}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                          <span>By {template.authorName}</span>
                          <span>•</span>
                          <span>{template.category}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-yellow-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs ml-1">{template.popularity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  No templates found matching your search criteria.
                </div>
              )}
            </div>
          </div>
          
          {/* Template Details */}
          <div className="w-1/3 p-4 flex flex-col">
            {selectedTemplate ? (
              <>
                <div className="flex-1 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-2">{selectedTemplate.name}</h3>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(selectedTemplate.difficultyLevel)}`}>
                      {selectedTemplate.difficultyLevel}
                    </span>
                    <span className="text-xs text-gray-400">
                      Created by {selectedTemplate.authorName}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4">
                    {selectedTemplate.description}
                  </p>
                  
                  {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplate.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Template Preview</h4>
                    <div className="bg-gray-750 border border-gray-700 rounded-lg p-4 h-40 flex items-center justify-center">
                      <p className="text-sm text-gray-400 text-center">
                        {/* In a real app, this would display a mini-preview of the template structure */}
                        This template includes {
                          Object.keys(selectedTemplate.strategySnapshot.elements).length
                        } elements. Use this template as a starting point for your trading strategy.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  {error && (
                    <div className="bg-red-900 bg-opacity-20 text-red-500 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Strategy Name
                    </label>
                    <input
                      type="text"
                      value={strategyName}
                      onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setStrategyName(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                      placeholder="Enter a name for your strategy"
                    />
                  </div>
                  
                  <button
                    onClick={handleCreateFromTemplate}
                    disabled={isCreating || !strategyName.trim()}
                    className={`w-full px-4 py-2 rounded text-white flex items-center justify-center ${
                      isCreating || !strategyName.trim() 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : 'Use This Template'}
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-300">Select a template</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a template from the list to get started quickly
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
