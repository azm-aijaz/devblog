import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateBlog.css';

function CreateBlog() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    topic: 'Database',
    content: '',
    imageUrl: '',
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          imageUrl: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          imageUrl: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // ReactQuill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  // ReactQuill formats configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'code-block'
  ];

  return (
    <div className="main">
      <div className="container">
        <div className="blog-create">
          <h1 className="h2">Create New Blog Post</h1>

          <form onSubmit={handleSubmit} className="blog-form">
            {/* Cover Image Section */}
            <div className="form-group">
              <label htmlFor="cover-image" className="form-label">Cover Image</label>
              <div
                className={`image-uploader ${isDragging ? 'dragging' : ''} ${formData.imageUrl ? 'has-image' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} alt="Cover preview" className="cover-preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      <FiX />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="upload-content">
                      <FiUpload className="upload-icon" />
                      <p>Drag & drop an image here, or click to select</p>
                      <span>Recommended size: 1600x900px</span>
                    </div>
                    <input
                      type="file"
                      id="cover-image"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input title-input"
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
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="CSS">CSS</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">Content</label>
              <ReactQuill
                ref={quillRef}
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your story here..."
                className="quill-editor"
                theme="snow"
              />
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