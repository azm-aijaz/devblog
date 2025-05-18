import Hero from '@/components/Hero';
import Blog from '@/components/Blog';
import Aside from '@/components/Aside';

function BlogList() {

  return (
    <>
      <Hero />
      <div className="main">
        <div className="container-home">
          <Blog />
          <Aside />
        </div>
      </div>
    </>
  );
}

export default BlogList;