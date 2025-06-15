import { IoTimeOutline, IoPersonCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      
      // Fetch posts with authors and topics in a single query
        const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          author:authors (
            id,
            username,
            full_name,
            avatar_url
          ),
          topic:topics (
            id,
            name,
            icon
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });
      

      if (postsError) throw postsError;

      setBlogPosts(posts);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/images/pattern.png';
  };

  if (loading) {
    return <div className="loading">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="blog">
      <h2 className="h2">Latest Blog Posts</h2>
      <div className="blog-card-group">
        {blogPosts.map(post => (
          <div key={post.id} className="blog-card">
            <div className="blog-card-banner">
              <img 
                onClick={() => navigate(`/blog/${post.slug}`)}
                src={post.cover_image_url || '/images/placeholder.png'} 
                alt={post.title} 
                className="blog-banner-img"
                onError={handleImageError}
              />
            </div>

            <div className="blog-content-wrapper">
              <button className="blog-topic text-tiny">
                {post.topic?.name || 'General'}
              </button>
              <h3>
                <Link to={`/blog/${post.slug}`} className="h3">{post.title}</Link>
              </h3>
              <p className="blog-text">{post.excerpt}</p>

              <div className="wrapper-flex">
                <div className="profile-wrapper-container">
                <div className="profile-wrapper">
                  {post.author?.avatar_url ? (
                    <img 
                      src={post.author.avatar_url} 
                      alt=''
                      width="50"
                      onError={handleImageError}
                    />
                  ) : (
                    <IoPersonCircle 
                      size={48} 
                      className="default-avatar"
                    />
                  )}
              
                </div>
                <a href={`/author/${post.author?.username}`} className="h4 mob-author">
                    {post.author?.full_name || 'Author'}
                  </a>
                </div>
                <div className="wrapper">
                  <a href={`/author/${post.author?.username}`} className="h4 desk-author">
                    {post.author?.full_name || 'Author'}
                  </a>
                  <p className="text-sm">
                    <time dateTime={post.created_at}>
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <span className="separator"></span>
                    <IoTimeOutline />
                    <time dateTime={`PT${post.read_time || '3'}M`}>{post.read_time || '3'} min read</time>
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