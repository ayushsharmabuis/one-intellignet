import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ProfessionalCategory } from '../data/professionalCategories';

interface ProfessionalCategoriesProps {
  categories: ProfessionalCategory[];
  selectedCategory: string;
  selectedSubcategory: string;
  onSelectCategory: (categoryId: string, subcategoryId: string) => void;
}

const ProfessionalCategories: React.FC<ProfessionalCategoriesProps> = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([categories[0]?.id || '']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  return (
    <div className="w-full md:w-72 bg-one-darker rounded-lg border border-one-border p-4">
      <h3 className="text-lg font-semibold text-one-text mb-4">Professional Categories</h3>
      
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-one-dark/50 p-2 rounded-md"
              onClick={() => toggleCategory(category.id)}
            >
              <span className={`font-medium ${selectedCategory === category.id && !selectedSubcategory ? 'text-one-accent' : 'text-one-text'}`}>
                {category.name}
              </span>
              {expandedCategories.includes(category.id) ? (
                <ChevronDown size={18} className="text-one-text-muted" />
              ) : (
                <ChevronRight size={18} className="text-one-text-muted" />
              )}
            </div>
            
            {expandedCategories.includes(category.id) && (
              <div className="pl-4 space-y-1 border-l border-one-border ml-2">
                {category.subcategories.map((subcategory) => (
                  <div 
                    key={subcategory.id}
                    className={`p-2 rounded-md cursor-pointer text-sm ${
                      selectedCategory === category.id && selectedSubcategory === subcategory.id
                        ? 'bg-one-accent text-white'
                        : 'text-one-text-muted hover:bg-one-dark/70'
                    }`}
                    onClick={() => onSelectCategory(category.id, subcategory.id)}
                  >
                    {subcategory.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalCategories; 