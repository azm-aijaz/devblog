import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import Header from './components/Header';
import Homepage from './components/Homepage';
import BlogDetail from './components/BlogDetail';
import CreateBlog from './components/CreateBlog';
import Search from './components/Search';
import Footer from './components/Footer';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import LoadingSpinner from './components/LoadingSpinner';
import BlogListByTopic from './components/BlogListByTopic';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light-theme';
  });
  const { user } = useAuth();

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light-theme' ? 'dark-theme' : 'light-theme');
  };

  return (
    <Router>
      <div className={theme}>
        <Header theme={theme} toggleTheme={toggleTheme} user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/topic/:slug" element={<BlogListByTopic />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route 
              path="/write" 
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              } 
            />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;