// components/NodeWallToolbar.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';

interface LabelToolbarProps {
  onAddCategory: (categoryName: string) => void;
}

export const LabelToolbar = ({ onAddCategory }: LabelToolbarProps) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = () => {
    const name = categoryName.trim();
    if (!name) return;
    onAddCategory(name);
    setCategoryName('');
    setInputVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    } else if (e.key === 'Escape') {
      setInputVisible(false);
      setCategoryName('');
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-gray-200 bg-white">
      {inputVisible ? (
        <input
          autoFocus
          type="text"
          className="border border-gray-300 rounded px-2 py-1 w-40"
          placeholder="输入分类名称"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setInputVisible(false)}
        />
      ) : (
        <button
          className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
          onClick={() => setInputVisible(true)}
        >
          <Plus size={16} />
          新建分类
        </button>
      )}
    </div>
  );
};
