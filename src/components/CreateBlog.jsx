import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import TopicManager from './TopicManager';
import { supabase } from '../utils/supabase';
import { useAuth } from '../lib/AuthContext';
import 'react-quill/dist/quill.snow.css';
import './CreateBlog.css';

// Initial topics with icons
const initialTopics = [
  { name: 'Database', icon: 'IoServerOutline' },
  { name: 'Accessibility', icon: 'IoAccessibilityOutline' },
  { name: 'Web Performance', icon: 'IoRocketOutline' },
  { name: 'JavaScript', icon: 'IoLogoJavascript' },
  { name: 'React', icon: 'IoLogoReact' },
  { name: 'CSS', icon: 'IoLogoCss3' },
];

function CreateBlog() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    topic: initialTopics[0],
    content: '',
    imageUrl: '',
    tags: [],
    published: false
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching tags:', error);
      return;
    }
    
    setAvailableTags(data);
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First, upload the image if one is selected
      let finalImageUrl = '';
      if (selectedImage) {
        finalImageUrl = await uploadImage(selectedImage);
      }

      // Then, ensure the topic exists
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .upsert({
          name: formData.topic.name,
          slug: generateSlug(formData.topic.name),
          icon: formData.topic.icon
        })
        .select()
        .single();

      if (topicError) throw topicError;

      // Generate excerpt from content
      const excerpt = formData.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .substring(0, 200) // Get first 200 characters
        .trim() + '...'; // Add ellipsis

      // Create the post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          title: formData.title,
          content: formData.content,
          topic_id: topicData.id,
          cover_image_url: finalImageUrl,
          author_id: user.id,
          published: formData.published,
          slug: generateSlug(formData.title),
          read_time: calculateReadTime(formData.content),
          excerpt: excerpt
        })
        .select()
        .single();

      if (postError) throw postError;

      // Handle tags
      if (formData.tags.length > 0) {
        const tagPromises = formData.tags.map(async (tagName) => {
          const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .upsert({
              name: tagName,
              slug: generateSlug(tagName)
            })
            .select()
            .single();

          if (tagError) throw tagError;

          // Create post-tag relationship
          await supabase
            .from('post_tags')
            .insert({
              post_id: postData.id,
              tag_id: tagData.id
            });
        });

        await Promise.all(tagPromises);
      }

      // Clean up the preview URL
      if (formData.imageUrl) {
        URL.revokeObjectURL(formData.imageUrl);
      }

      navigate(`/blog/${postData.slug}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicSelect = (topic) => {
    setFormData(prev => ({
      ...prev,
      topic
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const newTag = value.replace(',', '').trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        e.target.value = ''; // Clear input after adding tag
      }
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !formData.tags.includes(value)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, value]
        }));
        e.target.value = ''; // Clear input after adding tag
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePublishChange = (e) => {
    setFormData(prev => ({
      ...prev,
      published: e.target.checked
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl
      }));
    }
  };

  const removeImage = () => {
    if (formData.imageUrl) {
      // Revoke the preview URL to avoid memory leaks
      URL.revokeObjectURL(formData.imageUrl);
      setSelectedImage(null);
      setFormData(prev => ({
        ...prev,
        imageUrl: ''
      }));
    }
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
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl
      }));
    }
  }, []);

  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `images/${fileName}`;
      const bucketName = 'byteblog';

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

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
              <label className="form-label">Topic</label>
              <TopicManager
                selectedTopic={formData.topic}
                onTopicSelect={handleTopicSelect}
                topics={initialTopics}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags" className="form-label">
                Tags
              </label>
              <div className="tags-input-container">
                <input
                  type="text"
                  id="tags"
                  placeholder="Add tags (press comma or enter)"
                  onKeyDown={handleTagKeyDown}
                  onChange={handleTagInput}
                  className="form-input"
                />
              </div>
              {formData.tags.length > 0 && (
                <div className="tags-preview">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag" onClick={() => removeTag(tag)}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="content" className="form-label">Content</label>
              <ReactQuill
                ref={quillRef}
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write here..."
                className="quill-editor"
                theme="snow"
              />
            </div>

            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={handlePublishChange}
                />
                <span>Publish immediately</span>
              </label>
              <p className="form-hint">
                {formData.published 
                  ? "Your post will be visible to everyone immediately after publishing."
                  : "Your post will be saved as a draft. You can publish it later."}
              </p>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : formData.published ? 'Publish Post' : 'Save as Draft'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;