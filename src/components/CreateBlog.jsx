import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoImageOutline } from 'react-icons/io5';

function CreateBlog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    topic: 'Database',
    content: '',
    imageUrl: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Blog post created:', formData);
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="main">
      <div className="container">
        <div className="blog-create">
          <h1 className="h2">Create New Blog Post</h1>
          
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your blog title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="topic" className="form-label">Topic</label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="Database">Database</option>
                <option value="Accessibility">Accessibility</option>
                <option value="Web Performance">Web Performance</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl" className="form-label">Cover Image URL</label>
              <div className="image-input-wrapper">
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter image URL"
                />
                <IoImageOutline className="image-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Write your blog content here..."
                rows="10"
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Publish Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;