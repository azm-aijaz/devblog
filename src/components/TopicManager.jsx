import { useState, useRef, useEffect } from 'react';
import * as Icons from 'react-icons/io5';
import IconPicker from './IconPicker';
import './TopicManager.css';

function TopicManager({ selectedTopic, onTopicSelect, topics = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', icon: 'IoServerOutline' });
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (newTopic.name.trim()) {
      onTopicSelect({ ...newTopic, isNew: true });
      setNewTopic({ name: '', icon: 'IoServerOutline' });
      setIsCreating(false);
      setIsOpen(false);
    }
  };

  const handleSelect = (topic) => {
    onTopicSelect(topic);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If the input matches an existing topic exactly, select it
    const exactMatch = topics.find(t => t.name.toLowerCase() === value.toLowerCase());
    if (exactMatch) {
      handleSelect(exactMatch);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isCreating) {
      e.preventDefault();
      // If there's no exact match and we have a search term, start creating
      const exactMatch = topics.find(t => t.name.toLowerCase() === searchTerm.toLowerCase());
      if (!exactMatch && searchTerm.trim()) {
        setIsCreating(true);
        setNewTopic(prev => ({ ...prev, name: searchTerm }));
      }
    }
  };

  // Get the icon component for the selected topic
  const SelectedIcon = selectedTopic?.icon ? Icons[selectedTopic.icon] : Icons.IoServerOutline;

  return (
    <div className="topic-manager" ref={containerRef}>
      <div className="topic-input-container">
        <div className="topic-input-wrapper" onClick={() => setIsOpen(true)}>
          {selectedTopic ? (
            <div className="selected-topic">
              <SelectedIcon className="topic-icon" />
              <span>{selectedTopic.name}</span>
            </div>
          ) : (
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Select or create a topic..."
              className="topic-input"
            />
          )}
          <button
            type="button"
            className="topic-dropdown-button"
            onClick={() => setIsOpen(!isOpen)}
          >
            ▼
          </button>
        </div>

        {isOpen && (
          <div className="topic-dropdown">
            {!isCreating ? (
              <>
                <div className="topic-search">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search topics..."
                    autoFocus
                  />
                </div>
                
                <div className="topic-list">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic) => {
                      const TopicIcon = Icons[topic.icon];
                      return (
                        <button
                          key={topic.name}
                          className={`topic-option ${selectedTopic?.name === topic.name ? 'selected' : ''}`}
                          onClick={() => handleSelect(topic)}
                        >
                          <TopicIcon className="topic-icon" />
                          <span>{topic.name}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="no-results">
                      No topics found
                      {searchTerm && (
                        <button
                          className="create-topic-button"
                          onClick={() => {
                            setIsCreating(true);
                            setNewTopic(prev => ({ ...prev, name: searchTerm }));
                          }}
                        >
                          Create "{searchTerm}"
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={handleCreateTopic} className="topic-creator">
                <div className="form-group">
                  <label htmlFor="topicName" className="form-label">Topic Name</label>
                  <input
                    type="text"
                    id="topicName"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    placeholder="Enter topic name"
                    autoFocus
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Topic Icon</label>
                  <IconPicker
                    selectedIcon={newTopic.icon}
                    onSelect={(icon) => setNewTopic(prev => ({ ...prev, icon }))}
                  />
                </div>
                <div className="topic-creator-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsCreating(false);
                      setNewTopic({ name: '', icon: 'IoServerOutline' });
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Topic
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TopicManager; 