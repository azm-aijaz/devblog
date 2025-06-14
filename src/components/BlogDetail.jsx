import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  IoTimeOutline, 
  IoEyeOutline, 
  IoHeartOutline, 
  IoHeart, 
  IoBookmarkOutline, 
  IoBookmark, 
  IoShareSocialOutline,
  IoPersonCircle 
} from 'react-icons/io5';
import { supabase } from '../utils/supabase';
import './BlogDetail.css';
import LoadingSpinner from './LoadingSpinner';

function BlogDetail() {
  const { slug } = useParams();
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First, fetch the blog post
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            topics (
              name,
              icon
            )
          `)
          .eq('slug', slug)
          .single();

        if (postError) {
          console.error('Post fetch error:', postError);
          throw postError;
        }

        if (!post) {
          setError('Blog post not found');
          setLoading(false);
          return;
        }

        console.log('Found post:', post);

        // Then fetch the author profile
        let profile = null;
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', post.author_id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          
          // If profile doesn't exist, create a default one
          if (profileError.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: post.author_id,
                full_name: 'Anonymous Author',
                avatar_url: null
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
            } else {
              profile = newProfile;
            }
          }
        } else {
          profile = existingProfile;
        }

        // Format the data
        const formattedBlog = {
          ...post,
          author: profile?.full_name || 'Anonymous',
          authorAvatar: profile?.avatar_url,
          topic: post.topics?.name,
          topicIcon: post.topics?.icon,
          date: new Date(post.created_at).toISOString(),
          readTime: `${post.read_time} min`
        };

        setBlog(formattedBlog);
        setLikes(post.like_count || 0);
        setViews(post.view_count || 0);

        // Check if this post has been viewed in this session
        const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '[]');
        if (!viewedPosts.includes(post.id)) {
          // Increment view count only if not viewed in this session
          await supabase
            .from('posts')
            .update({ view_count: (post.view_count || 0) + 1 })
            .eq('id', post.id);

          // Add post ID to viewed posts
          viewedPosts.push(post.id);
          localStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
          
          // Update local view count
          setViews(prev => prev + 1);
        }

      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleLike = async () => {
    if (!blog) return;

    try {
      const newLikeCount = isLiked ? likes - 1 : likes + 1;
      const { error } = await supabase
        .from('posts')
        .update({ like_count: newLikeCount })
        .eq('id', blog.id);

      if (error) throw error;

      setLikes(newLikeCount);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="main">
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="main">
        <div className="container">
          <div className="not-found">Blog post not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="container">
        <article className="blog-detail">
          <div className="blog-detail-header">
            <h1 className="h1">{blog.title}</h1>

            <div className="blog-meta">
              <div className="blog-info">
                <div className="profile-wrapper">
                  {blog.authorAvatar ? (
                    <img 
                      src={blog.authorAvatar} 
                      alt={blog.author}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <IoPersonCircle 
                    size={48} 
                    className="default-avatar"
                  />
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

          {blog.cover_image_url && (
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              className="blog-detail-banner"
            />
          )}

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