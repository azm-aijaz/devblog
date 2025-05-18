import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import CreateBlog from './components/CreateBlog';
import Aside from './components/Aside';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light-theme');

  const toggleTheme = () => {
    setTheme(theme === 'light-theme' ? 'dark-theme' : 'light-theme');
  };
  return (
    <Router>
      <div className={theme}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <div className="main">
                  <div className="container">
                    <Blog />
                    <Aside />
                  </div>
                </div>
              </>
            } />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/create" element={<CreateBlog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;