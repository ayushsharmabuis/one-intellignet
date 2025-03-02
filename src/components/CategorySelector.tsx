
import React from 'react';

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 my-6">
      <button
        key="all"
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
          selectedCategory === 'all'
            ? 'bg-one-accent text-white shadow-glow-sm'
            : 'bg-one-light text-one-text-muted hover:bg-one-light/80'
        }`}
      >
        All Tools
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
            selectedCategory === category
              ? 'bg-one-accent text-white shadow-glow-sm'
              : 'bg-one-light text-one-text-muted hover:bg-one-light/80'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
