import Sidebar from '../layouts/Sidebar.tsx';
import Content from '../layouts/Content.tsx';
import Navbar from '../layouts/Navbar.tsx';

function Home (){
    return (<>
        <Navbar />
        <div className="flex bg-black h-[calc(100vh-72px)] overflow-hidden">
          <Sidebar />
          <Content />
        </div>  
    </>)
     
}
export default Home;