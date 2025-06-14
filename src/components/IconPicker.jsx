import { useState, useMemo } from 'react';
import * as Icons from 'react-icons/io5';
import './IconPicker.css';

// Helper function to categorize icons based on their names
const categorizeIcon = (iconName) => {
  const name = iconName.toLowerCase();
  
  if (name.includes('logo')) return 'Brands';
  if (name.includes('server') || name.includes('database') || name.includes('cloud')) return 'Infrastructure';
  if (name.includes('code') || name.includes('terminal') || name.includes('bug')) return 'Development';
  if (name.includes('analytics') || name.includes('chart') || name.includes('stats')) return 'Analytics';
  if (name.includes('mobile') || name.includes('phone') || name.includes('tablet')) return 'Devices';
  if (name.includes('ui') || name.includes('interface') || name.includes('design')) return 'UI/UX';
  if (name.includes('security') || name.includes('shield') || name.includes('lock')) return 'Security';
  if (name.includes('network') || name.includes('wifi') || name.includes('connection')) return 'Network';
  if (name.includes('file') || name.includes('document') || name.includes('folder')) return 'Files';
  if (name.includes('media') || name.includes('image') || name.includes('video')) return 'Media';
  if (name.includes('notification') || name.includes('alert') || name.includes('warning')) return 'Notifications';
  if (name.includes('settings') || name.includes('config') || name.includes('preferences')) return 'Settings';
  if (name.includes('user') || name.includes('profile') || name.includes('account')) return 'User';
  if (name.includes('time') || name.includes('clock') || name.includes('calendar')) return 'Time';
  if (name.includes('location') || name.includes('map') || name.includes('gps')) return 'Location';
  if (name.includes('weather') || name.includes('sun') || name.includes('moon')) return 'Weather';
  if (name.includes('game') || name.includes('play') || name.includes('controller')) return 'Gaming';
  if (name.includes('social') || name.includes('share') || name.includes('like')) return 'Social';
  if (name.includes('mail') || name.includes('message') || name.includes('chat')) return 'Communication';
  if (name.includes('shop') || name.includes('cart') || name.includes('store')) return 'E-commerce';
  if (name.includes('accessibility') || name.includes('wheelchair')) return 'Accessibility';
  
  return 'General';
};

function IconPicker({ selectedIcon, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOpen, setIsOpen] = useState(false);

  // Dynamically get all icons and categorize them
  const iconOptions = useMemo(() => {
    return Object.entries(Icons)
      .filter(([name]) => name !== 'default') // Filter out the default export
      .map(([name, component]) => ({
        name: name.replace(/^Io/, '').replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to spaces
        component: name,
        category: categorizeIcon(name)
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    return ['All', ...new Set(iconOptions.map(icon => icon.category))].sort();
  }, [iconOptions]);

  // Filter icons based on search term and category
  const filteredIcons = useMemo(() => {
    return iconOptions.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [iconOptions, searchTerm, selectedCategory]);

  const selectedIconData = iconOptions.find(icon => icon.component === selectedIcon);
  const IconComponent = selectedIconData ? Icons[selectedIconData.component] : Icons.IoServerOutline;

  return (
    <div className="icon-picker-container">
      <div className="icon-picker-trigger" onClick={() => setIsOpen(!isOpen)}>
        <div className="selected-icon">
          <IconComponent />
          <span>{selectedIconData?.name || 'Select Icon'}</span>
        </div>
      </div>

      {isOpen && (
        <div className="icon-picker-dropdown">
          <div className="icon-picker-header">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="icon-search"
            />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="icon-category"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="icon-grid">
            {filteredIcons.map(icon => {
              const IconComponent = Icons[icon.component];
              return (
                <button
                  key={icon.name}
                  className={`icon-option ${selectedIcon === icon.component ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(icon.component);
                    setIsOpen(false);
                  }}
                  title={icon.name}
                >
                  <IconComponent />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default IconPicker; 