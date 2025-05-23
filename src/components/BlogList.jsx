import { IoTimeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

function Blog() {
  const blogPosts = [
    {
      id: 1,
      image: '/images/blog-1.png',
      title: 'Building microservices with Dropwizard, MongoDB & Docker',
      topic: 'Database',
      text: 'This NoSQL database oriented to documents (by documents like JSON) combines some of the features from relational databases, easy to use and the multi-platform is the best option for scale up and have fault tolerance, load balancing, map reduce, etc.',
      date: '2022-01-17',
      readTime: '3 min'
    },
    {
      id: 2,
      image: '/images/blog-2.png',
      title: 'Building microservices with Dropwizard, MongoDB & Docker',
      topic: 'Database',
      text: 'This NoSQL database oriented to documents (by documents like JSON) combines some of the features from relational databases, easy to use and the multi-platform is the best option for scale up and have fault tolerance, load balancing, map reduce, etc.',
      date: '2022-01-17',
      readTime: '3 min'
    },
    {
      id: 3,
      image: '/images/blog-3.png',
      title: 'Building microservices with Dropwizard, MongoDB & Docker',
      topic: 'Database',
      text: 'This NoSQL database oriented to documents (by documents like JSON) combines some of the features from relational databases, easy to use and the multi-platform is the best option for scale up and have fault tolerance, load balancing, map reduce, etc.',
      date: '2022-01-17',
      readTime: '3 min'
    },
    {
      id: 4,
      image: '/images/blog-4.png',
      title: 'Building microservices with Dropwizard, MongoDB & Docker',
      topic: 'Database',
      text: 'This NoSQL database oriented to documents (by documents like JSON) combines some of the features from relational databases, easy to use and the multi-platform is the best option for scale up and have fault tolerance, load balancing, map reduce, etc.',
      date: '2022-01-17',
      readTime: '3 min'
    },
    {
      id: 5,
      image: '/images/blog-5.png',
      title: 'Building microservices with Dropwizard, MongoDB & Docker',
      topic: 'Database',
      text: 'This NoSQL database oriented to documents (by documents like JSON) combines some of the features from relational databases, easy to use and the multi-platform is the best option for scale up and have fault tolerance, load balancing, map reduce, etc.',
      date: '2022-01-17',
      readTime: '3 min'
    },
    {
      id: 6,
      image: '/images/blog-6.png',
      title: 'Building microservices with Dropwizard, MongoDB & Docker',
      topic: 'Database',
      text: 'This NoSQL database oriented to documents (by documents like JSON) combines some of the features from relational databases, easy to use and the multi-platform is the best option for scale up and have fault tolerance, load balancing, map reduce, etc.',
      date: '2022-01-17',
      readTime: '3 min'
    },
    // Add more blog posts here
  ];

  return (
    <div className="blog">
      <h2 className="h2">Latest Blog Post</h2>
      <div className="blog-card-group">
        {blogPosts.map(post => (
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
                  <a href="#" class="h4 mob-author">Julia Walker</a>
                </div>

                <div className="wrapper">
                  <a href="#" className="h4 desk-author">Julia Walker</a>
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
      </div>
      <button className="btn load-more">Load More</button>
    </div>
  );
}

export default Blog;