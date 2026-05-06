import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminLogin() {
    const [form, setForm] = useState({ email: '', pass: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let email = form.email;
        if (/^\d{9}$/.test(email)) {
            email = `${email}@mvbanderas.pe`;
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: form.pass,
        });

        if (authError) {
            setError(authError.message === 'Invalid login credentials' 
                ? 'Email o contraseña incorrectos' 
                : authError.message);
        }

        setLoading(false);
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
                        <label>Email</label>
                        <input
                            type="text"
                            placeholder="email@ejemplo.com o celular"
                            value={form.email}
                            onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
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
