import Content from '../layouts/Content.tsx';
import Navbar from '../layouts/Navbar';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';

function Home (){
    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <Content />
        </div>
        <Player />
    </>)
}

export default Home;