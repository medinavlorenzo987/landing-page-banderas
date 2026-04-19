import { useState } from 'react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'banderas2024';

export default function AdminLogin({ onLogin }) {
    const [form, setForm] = useState({ user: '', pass: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            if (form.user === ADMIN_USER && form.pass === ADMIN_PASS) {
                onLogin();
            } else {
                setError('Usuario o contraseña incorrectos');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-box">
                <div className="admin-login-logo">
                    <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h1>Panel Administrador</h1>
                <p>Ingresa tus credenciales para continuar</p>

                <form onSubmit={handleSubmit}>
                    <div className="admin-field">
                        <label>Usuario</label>
                        <input
                            type="text"
                            placeholder="admin"
                            value={form.user}
                            onChange={(e) => { setForm({ ...form, user: e.target.value }); setError(''); }}
                            autoComplete="username"
                        />
                    </div>
                    <div className="admin-field">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.pass}
                            onChange={(e) => { setForm({ ...form, pass: e.target.value }); setError(''); }}
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <p className="admin-login-error">{error}</p>}
                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
