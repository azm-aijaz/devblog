import Hero from '@/components/Hero';
import BlogList from '@/components/BlogList';
import Aside from '@/components/Aside';

function Home() {

  return (
    <>
      <Hero />
      <div className="main">
        <div className="container blog-list">
          <BlogList />
          <Aside />
        </div>
      </div>
    </>
  );
}

export default Home;