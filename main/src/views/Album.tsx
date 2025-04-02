import Sidebar from '../layouts/Sidebar.tsx';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import List from '../components/com_list.tsx'
import Artist from '../components/com_artist.tsx'

function Album (){
    return (<>
        <Navbar />
        <div className="flex bg-black h-[calc(100vh-72px)] overflow-hidden">
            <Sidebar />
            <div className="bg-gray-800 h-[calc(100vh-100px)] w-full m-2 rounded-2xl overflow-y-scroll">                
                <List />
                <div className="mt-5">
                    <Artist/>
                    <Footer />
                </div>
                
            </div>
        </div>  
    </>)
     
}
export default Album;