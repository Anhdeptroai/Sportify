import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface RequireAuthProps {
    children: ReactNode;
    message?: string;
}

const RequireAuth = ({ children, message = 'Vui lòng đăng nhập để sử dụng tính năng này' }: RequireAuthProps) => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    if (!isLoggedIn) {
        if (window.confirm(message)) {
            navigate('/login');
        }
        return null;
    }

    return <>{children}</>;
};

export default RequireAuth; 