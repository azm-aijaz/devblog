import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoTimeOutline, IoEyeOutline, IoHeartOutline, IoHeart, IoBookmarkOutline, IoBookmark } from 'react-icons/io5';

function BlogDetail() {
  const { id } = useParams();
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Simulate view count increment on page load
  useEffect(() => {
    setViews(prev => prev + 1);
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

  return (
    <div className="main">
      <div className="container">
        <article className="blog-detail">
          <div className="blog-detail-header">
            <h1 className="h1">Building microservices with Dropwizard, MongoDB & Docker</h1>
            
            <div className="blog-meta">
              <div className="profile-wrapper">
                <img src="/assets/images/author.png" alt="Julia Walker" width="50" />
                <div className="wrapper">
                  <a href="#" className="h4">Julia Walker</a>
                  <p className="text-sm">
                    <time dateTime="2022-01-17">Jan 17, 2022</time>
                    <span className="separator"></span>
                    <IoTimeOutline />
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
                  {isSaved ? <IoBookmark /> : <IoBookmarkOutline />}
                </button>
              </div>
            </div>
          </div>

          <img 
            src="/assets/images/blog-1.png" 
            alt="Building microservices with Dropwizard, MongoDB & Docker" 
            className="blog-detail-banner"
          />

          <div className="blog-detail-content">
            <p>
              This NoSQL database oriented to documents (by documents like JSON) combines some of the features from
              relational databases, easy to use and the multi-platform is the best option for scale up and have fault
              tolerance, load balancing, map reduce, etc.
            </p>

            <h2 className="h2">What is MongoDB?</h2>
            <p>
              MongoDB is a document database with the scalability and flexibility that you want with the querying
              and indexing that you need. Here are some of the key features of MongoDB.
            </p>

            <h3 className="h3">Key Features:</h3>
            <ul>
              <li>Document Oriented Storage</li>
              <li>High Performance</li>
              <li>High Availability</li>
              <li>Easy Scalability</li>
              <li>Rich Query Language</li>
            </ul>

            {/* Add more content as needed */}
          </div>
        </article>
      </div>
    </div>
  );
}

export default BlogDetail;