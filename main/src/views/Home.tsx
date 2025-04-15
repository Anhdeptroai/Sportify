import Sidebar from '../layouts/Sidebar.tsx';
import Content from '../layouts/Content.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';

function Home (){
    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
          <Sidebar />
          <Content />
        </div>  
        <Player />
        <audio preload='auto'></audio>
    </>)
     
}
export default Home;