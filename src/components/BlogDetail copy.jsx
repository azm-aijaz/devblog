import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoTimeOutline, IoEyeOutline, IoHeartOutline, IoHeart, IoBookmarkOutline, IoBookmark, IoShareSocialOutline } from 'react-icons/io5';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function BlogDetail() {
  const { id } = useParams();
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [content, setContent] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  useEffect(() => {
    setViews(prev => prev + 1);
    // Initialize with some content
    setContent(`
      <h2>What is MongoDB?</h2>
      <p>MongoDB is a document database with the scalability and flexibility that you want with the querying
      and indexing that you need. Here are some of the key features of MongoDB.</p>
      
      <h3>Key Features:</h3>
      <ul>
        <li>Document Oriented Storage</li>
        <li>High Performance</li>
        <li>High Availability</li>
        <li>Easy Scalability</li>
        <li>Rich Query Language</li>
      </ul>
    `);
  }, []);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Building microservices with Dropwizard, MongoDB & Docker',
        url: window.location.href
      });
    }
  };

  return (
    <div className="main">
      <div className="container">
        <article className="blog-detail">
          <div className="blog-detail-header">
            <h1 className="h1">Building microservices with Dropwizard, MongoDB & Docker</h1>

            <div className="blog-meta">
              <div className="blog-info">
                <div className="profile-wrapper">
                  <img src="/images/author.png" alt="Julia Walker" />
                </div>
                <div className="wrapper">
                  <a href="#" className="author-name">Julia Walker</a>
                  <p className="meta">
                    <time dateTime="2022-01-17">Jan 17, 2022</time>
                    <span className="dot">·</span>
                    <IoTimeOutline size={14} />
                    <time dateTime="PT3M">3 min read</time>
                  </p>
                </div>
              </div>

              <div className="blog-stats">
                <button className="stat-btn">
                  <IoEyeOutline /> {views} views
                </button>
                <button className={`stat-btn ${isLiked ? 'active' : ''}`} onClick={handleLike}>
                  {isLiked ? <IoHeart /> : <IoHeartOutline />} {likes} likes
                </button>
                <button className={`stat-btn ${isSaved ? 'active' : ''}`} onClick={handleSave}>
                  {isSaved ? <IoBookmark /> : <IoBookmarkOutline />} Save
                </button>
                <button className="stat-btn" onClick={handleShare}>
                  <IoShareSocialOutline /> Share
                </button>
              </div>
            </div>

          </div>

          <img
            src="/images/blog-1.png"
            alt="Building microservices with Dropwizard, MongoDB & Docker"
            className="blog-detail-banner"
          />

          <div className="blog-detail-content">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              readOnly={false}
              theme="snow"
            />
          </div>
        </article>
      </div>
    </div>
  );
}

export default BlogDetail;