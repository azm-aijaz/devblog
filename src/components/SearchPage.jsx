import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { IoTimeOutline } from 'react-icons/io5';

function SearchSkeleton() {
  return (
    <div className="blog-card skeleton">
      <div className="blog-card-banner skeleton-img"></div>
      <div className="blog-content-wrapper">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text skeleton-meta"></div>
      </div>
    </div>
  );
}

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          image: '/images/blog-1.png',
          title: 'Building microservices with Dropwizard, MongoDB & Docker',
          topic: 'Database',
          text: 'This NoSQL database oriented to documents combines some of the features from relational databases.',
          date: '2022-01-17',
          readTime: '3 min'
        },
        {
          id: 2,
          image: '/images/blog-2.png',
          title: 'Fast web page loading on a $20 feature phone',
          topic: 'Web Performance',
          text: 'Feature phones are affordable devices enabling millions of users in developing countries to leverage the web.',
          date: '2022-01-16',
          readTime: '2 min'
        }
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1500);
  }, [query]);

  return (
    <div className="main">
      <div className="container">
        <div className="search-results">
          <h2 className="h2">Search Results for "{query}"</h2>
          <div className="blog-card-group">
            {loading ? (
              <>
                <SearchSkeleton />
                <SearchSkeleton />
                <SearchSkeleton />
              </>
            ) : (
              results.map(post => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;