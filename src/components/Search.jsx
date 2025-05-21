import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoTimeOutline, IoSearchOutline } from 'react-icons/io5';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Mock search results - replace with actual search logic
    const results = [
      {
        id: 1,
        title: 'Building microservices with Dropwizard, MongoDB & Docker',
        topic: 'Database',
        text: 'This NoSQL database oriented to documents combines some of the features from relational databases, easy to use and the multi-platform is the best option for scale up.',
        date: '2022-01-17',
        readTime: '3 min',
        image: '/images/blog-1.png'
      },
      {
        id: 2,
        title: 'Fast web page loading on a $20 feature phone',
        topic: 'Web Performance',
        text: 'Feature phones are affordable devices enabling millions of users in developing countries to leverage the web. Think of them as a light version of a smart phone.',
        date: '2021-12-10',
        readTime: '2 min',
        image: '/images/blog-2.png'
      }
    ].filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
  };

  return (
    <div className="main">
      <div className="container">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <IoSearchOutline className="search-icon" />
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          <div className="search-results">
            {searchResults.map(post => (
              <div key={post.id} className="blog-card">
                <div className="blog-card-banner">
                  <img src={post.image} alt={post.title} className="blog-banner-img" />
                </div>

                <div className="blog-content-wrapper">
                  <button className="blog-topic text-tiny">{post.topic}</button>
                  <h3>
                    <Link to={`/blog/${post.id}`} className="h3">{post.title}</Link>
                  </h3>
                  <p className="blog-text">{post.text}</p>

                  <div className="wrapper-flex">
                    <div className="profile-wrapper">
                      <img src="/images/author.png" alt="Julia Walker" width="50" />
                    </div>

                    <div className="wrapper">
                      <a href="#" className="h4">Julia Walker</a>
                      <p className="text-sm">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                        <span className="separator"></span>
                        <IoTimeOutline />
                        <time dateTime={`PT${post.readTime.split(' ')[0]}M`}>{post.readTime}</time>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {searchQuery && searchResults.length === 0 && (
              <div className="no-results">
                <h2 className="h2">No results found</h2>
                <p>Try different keywords or remove search filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;