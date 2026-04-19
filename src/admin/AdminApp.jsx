import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import './admin.css';

export default function AdminApp() {
    const [authenticated, setAuthenticated] = useState(
        () => sessionStorage.getItem('admin_auth') === '1'
    );

    const handleLogin = () => {
        sessionStorage.setItem('admin_auth', '1');
        setAuthenticated(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        setAuthenticated(false);
    };

    return authenticated
        ? <AdminPanel onLogout={handleLogout} />
        : <AdminLogin onLogin={handleLogin} />;
}
