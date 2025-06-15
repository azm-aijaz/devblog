import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  const transformQuillContent = (content) => {
    if (!content) return '';
    
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Find all Quill code block containers
    const codeBlocks = tempDiv.querySelectorAll('.ql-code-block-container');
    
    codeBlocks.forEach(container => {
      // Get all code lines
      const codeLines = Array.from(container.querySelectorAll('.ql-code-block'))
        .map(line => line.textContent)
        .join('\n');

      // Get the language from the first code block div
      let language = container.querySelector('.ql-code-block')?.getAttribute('data-language');
      let highlightedCode;
      
      // Create highlighted code
      if (hljs.getLanguage(language)) {
        // If language is supported, use it
        highlightedCode = hljs.highlight(codeLines, { language }).value;
      } else {
        // Otherwise use auto-detection
        const hljsAuto = hljs.highlightAuto(codeLines);
        language = hljsAuto.language;
        highlightedCode = hljsAuto.value;
      }

      // Create new pre element with highlighted code
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      pre.className = `language-${language}`;
      code.innerHTML = highlightedCode;
      pre.appendChild(code);

      container.replaceWith(pre);
    });

    return tempDiv.innerHTML;
  };

  const [transformedContent, setTransformedContent] = useState('');
  const { VITE_SUPABASE_ANON_KEY } = import.meta.env;

async function fetchPostBySlug(slug) {
  const res = await fetch(`/api/posts?select=id,title,content,slug,read_time,view_count,like_count,created_at,author:authors(full_name,avatar_url),topic:topics(name,icon)&slug=eq.${slug}`, {
    headers: {
      apikey: VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch post: ${res.statusText}`);
  }

  const data = await res.json();
  return data[0]; // because Supabase returns an array
}


  useEffect(() => {
    if (blog?.content) {
      const transformed = transformQuillContent(blog.content);
      setTransformedContent(transformed);
    }
  }, [blog]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch post with author and topic in a single query
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            slug,
            read_time,
            view_count,
            like_count,
            created_at,
            author:authors (
              full_name,
              avatar_url
            ),
            topic:topics (
              name,
              icon
            )
          `)
          .eq('slug', slug)
          .single();

        if (postError) {
          throw postError;
        }

        if (!post) {
          setError('Blog post not found');
          setLoading(false);
          // navigate('/404', { replace: true });
          return;
        }

        // Format the data
        const formattedBlog = {
          ...post,
          author: post.author?.full_name || 'Anonymous Author',
          authorAvatar: post.author?.avatar_url,
          topic: post.topic?.name,
          topicIcon: post.topic?.icon,
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

        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug, navigate]);

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
                      alt=''
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
            dangerouslySetInnerHTML={{ __html: transformedContent }}
          />
        </article>
      </div>
    </div>
  );
}

export default BlogDetail;