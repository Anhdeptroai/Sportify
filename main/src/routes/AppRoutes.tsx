import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from '../views/Home.tsx';
import Login from '../views/Login.tsx';
import Register from '../views/Register.tsx';
import Artist from '../views/Artist.tsx';
import Album from '../views/Album.tsx';

const AppRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/artist" element={<Artist />} />
                <Route path="/album" element={<Album />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </Router>
    )
}

export default AppRoutes
