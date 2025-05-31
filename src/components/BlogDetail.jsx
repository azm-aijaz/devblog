import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoTimeOutline, IoEyeOutline, IoHeartOutline, IoHeart, IoBookmarkOutline, IoBookmark, IoShareSocialOutline } from 'react-icons/io5';

function BlogDetail() {
  const { id } = useParams();
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [blog, setBlog] = useState({
    title: 'Building microservices with Dropwizard, MongoDB & Docker',
    author: 'Julia Walker',
    date: '2022-01-17',
    readTime: '3 min',
    content: `
      <h2>What is MongoDB?</h2>
      <p>MongoDB is a document database with the scalability and flexibility that you want with the querying
      and indexing that you need. Here are some of the key features of MongoDB.</p>
      
      <h3>Key Features:</h3>
      <ul>
        <li>Document Oriented Storage - JSON-like documents with dynamic schemas offer simplicity and power.</li>
        <li>High Performance - MongoDB provides high performance data persistence.</li>
        <li>High Availability - Replica sets ensure high availability.</li>
        <li>Easy Scalability - MongoDB scales horizontally using sharding.</li>
        <li>Rich Query Language - MongoDB supports rich queries.</li>
      </ul>

      <h2>Why use MongoDB?</h2>
      <p>MongoDB is built on a scale-out architecture that has become popular with developers of all kinds for developing scalable applications with evolving data schemas.</p>
      
      <p>As a document database, MongoDB makes it easy for developers to store structured or unstructured data. It uses a JSON-like format to store documents. This format directly maps to native objects in most modern programming languages, making it a natural choice for developers.</p>
      
      <h3>MongoDB and Microservices</h3>
      <p>MongoDB is a great fit for microservices architecture because:</p>
      <ul>
        <li>Each microservice can have its own data model</li>
        <li>Independent scaling of services</li>
        <li>Better performance through data locality</li>
        <li>Simplified deployment and operations</li>
      </ul>
    `
  });

  useEffect(() => {
    setViews(prev => prev + 1);
    // Here you would typically fetch the blog data using the id
  }, [id]);

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
        title: blog.title,
        url: window.location.href
      });
    }
  };

  return (
    <div className="main">
      <div className="container">
        <article className="blog-detail">
          <div className="blog-detail-header">
            <h1 className="h1">{blog.title}</h1>

            <div className="blog-meta">
              <div className="blog-info">
                <div className="profile-wrapper">
                  <img src="/images/author.png" alt={blog.author} />
                </div>
                <div className="wrapper">
                  <a href="#" className="author-name">{blog.author}</a>
                  <p className="meta">
                    <time dateTime={blog.date}>
                      {new Date(blog.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <span className="dot">·</span>
                    <IoTimeOutline size={14} />
                    <time dateTime={`PT${blog.readTime.split(' ')[0]}M`}>{blog.readTime}</time>
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
            alt={blog.title}
            className="blog-detail-banner"
          />

          <div 
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    </div>
  );
}

export default BlogDetail;