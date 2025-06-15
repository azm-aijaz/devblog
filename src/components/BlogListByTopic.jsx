import { IoTimeOutline, IoPersonCircle } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import LoadingSpinner from './LoadingSpinner';

function BlogListByTopic() {
  const { slug } = useParams();
  const [blogPosts, setBlogPosts] = useState([]);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const POSTS_PER_PAGE = 5;

  useEffect(() => {
    fetchTopicAndPosts();
  }, [slug]);

  const fetchTopicAndPosts = async (pageNum = 0) => {
    try {
      setLoading(true);
      
      // First fetch the topic details
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('slug', slug)
        .single();

      if (topicError) throw topicError;
      setTopic(topicData);

      // Then fetch posts for this topic with pagination
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
            slug
          )
        `)
        .eq('topic_id', topicData.id)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(pageNum * POSTS_PER_PAGE, (pageNum + 1) * POSTS_PER_PAGE - 1);

      if (postsError) throw postsError;

      // Check if we have more posts to load
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('topic_id', topicData.id)
        .eq('published', true);

      setHasMore(count > (pageNum + 1) * POSTS_PER_PAGE);

      if (pageNum === 0) {
        setBlogPosts(posts);
      } else {
        setBlogPosts(prev => [...prev, ...posts]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching topic posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchTopicAndPosts(nextPage);
  };

  const handleImageError = (e) => {
    e.target.src = '/images/pattern.png';
  };

  if (loading && page === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!topic) {
    return <div className="not-found">Topic not found</div>;
  }

  return (
    <div className="main">
      <div className="container">
        <div className="blog">
          <h2 className="h2">Posts in {topic.name}</h2>
          {blogPosts.length === 0 ? (
            <p className="no-posts">No posts found in this topic yet.</p>
          ) : (
            <>
              <div className="blog-card-group">
                {blogPosts.map(post => (
                  <div key={post.id} className="blog-card">
                    <div className="blog-card-banner">
                      <img 
                        onClick={() => navigate(`/blog/${post.slug}`)}
                        src={post.cover_image_url || '/images/placeholder.png'} 
                        alt='' 
                        className="blog-banner-img"
                        onError={handleImageError}
                      />
                    </div>

                    <div className="blog-content-wrapper">
                      <button 
                        onClick={() => navigate(`/topic/${post.topic?.slug}`)}
                        className="blog-topic text-tiny">
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
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button 
                    className="btn btn-primary load-more" 
                    onClick={handleLoadMore}
                    disabled={loading}
                    style={{ minWidth: '200px' }}
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogListByTopic; 