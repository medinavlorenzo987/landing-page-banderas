import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const toEmail = (phone) => `${phone}@mvbanderas.pe`;

const TITLES = {
    login:           'Iniciar sesión',
    register:        'Crear cuenta',
    'change-password': 'Cambiar contraseña',
};

const SUBS = {
    login:           'Ingresa tu número de celular para continuar',
    register:        'Regístrate en segundos con tu número',
    'change-password': 'Elige una nueva contraseña para tu cuenta',
};

export default function LoginModal({ initialMode = 'login', onClose }) {
    const [mode, setMode] = useState(initialMode);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const phoneRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        phoneRef.current?.focus();
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Auto-fill password with phone number unless user touched it
    useEffect(() => {
        if (mode === 'register' && !passwordTouched) {
            setPassword(phone);
        }
    }, [phone, mode, passwordTouched]);

    const resetForm = () => {
        setPhone(''); setName(''); setPassword('');
        setNewPassword(''); setConfirmPassword('');
        setPasswordTouched(false); setError(''); setSuccess('');
    };

    const switchMode = (next) => { resetForm(); setMode(next); };

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 9);
        setPhone(val);
        setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordTouched(true);
        setError('');
    };

    const validatePhone = () => {
        if (!/^9\d{8}$/.test(phone)) {
            setError('Ingresa un número válido de 9 dígitos (empieza con 9)');
            return false;
        }
        return true;
    };

    // ── LOGIN ──────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validatePhone()) return;
        if (!password) { setError('Ingresa tu contraseña'); return; }
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: toEmail(phone),
            password,
        });
        setLoading(false);
        if (error) setError('Número o contraseña incorrectos');
        else onClose();
    };

    // ── REGISTER ───────────────────────────────────────
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setError('Ingresa tu nombre'); return; }
        if (!validatePhone()) return;
        if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
        setLoading(true);

        const { error: signUpError } = await supabase.auth.signUp({
            email: toEmail(phone),
            password,
            options: { data: { full_name: name.trim(), phone } },
        });

        if (signUpError) {
            setLoading(false);
            if (signUpError.message.includes('already registered')) {
                setError('Este número ya tiene una cuenta. Inicia sesión.');
            } else {
                setError(signUpError.message);
            }
            return;
        }

        // Auto-login after registration
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: toEmail(phone),
            password,
        });

        setLoading(false);
        if (!signInError) {
            onClose();
        } else {
            setSuccess('¡Cuenta creada! Ya puedes iniciar sesión con tu número.');
        }
    };

    // ── CHANGE PASSWORD ────────────────────────────────
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) { setError('Mínimo 6 caracteres'); return; }
        if (newPassword !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setLoading(false);
        if (error) setError('No se pudo actualizar. Intenta de nuevo.');
        else setSuccess('¡Contraseña actualizada correctamente!');
    };

    const handleSubmit = mode === 'login' ? handleLogin
        : mode === 'register' ? handleRegister
        : handleChangePassword;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box login-modal-box" role="dialog" aria-modal="true" aria-labelledby="login-title">

                <button className="modal-close" onClick={onClose} aria-label="Cerrar">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>

                {/* Header */}
                <div className="login-modal-header">
                    <div className="login-modal-icon">
                        <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>
                    <h2 className="modal-title" id="login-title" style={{ marginBottom: 0 }}>
                        {TITLES[mode]}
                    </h2>
                    <p className="login-modal-sub">{SUBS[mode]}</p>
                </div>

                {/* Success state */}
                {success ? (
                    <div className="login-success">
                        <svg width="44" height="44" fill="none" stroke="#16a34a" viewBox="0 0 24 24" strokeWidth="1.6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p>{success}</p>
                        {mode !== 'change-password' && (
                            <button className="login-switch-btn" onClick={() => switchMode('login')}>
                                Ir a iniciar sesión
                            </button>
                        )}
                        {mode === 'change-password' && (
                            <button className="modal-submit" style={{ marginTop: '0.5rem' }} onClick={onClose}>
                                Cerrar
                            </button>
                        )}
                    </div>
                ) : (
                    <form className="modal-form" onSubmit={handleSubmit} noValidate>

                        {/* Nombre — solo en registro */}
                        {mode === 'register' && (
                            <div className="modal-field">
                                <label htmlFor="login-name">Nombre completo</label>
                                <input
                                    id="login-name"
                                    type="text"
                                    placeholder="Ej: Juan Pérez"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setError(''); }}
                                    autoComplete="name"
                                />
                            </div>
                        )}

                        {/* Teléfono — login y registro */}
                        {mode !== 'change-password' && (
                            <div className="modal-field">
                                <label htmlFor="login-phone">Número de celular</label>
                                <div className="login-phone-wrap">
                                    <span className="login-phone-prefix">+51</span>
                                    <input
                                        id="login-phone"
                                        ref={phoneRef}
                                        type="tel"
                                        inputMode="numeric"
                                        placeholder="987 654 321"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        maxLength={9}
                                        autoComplete="tel"
                                        className="login-phone-input"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Contraseña — login y registro */}
                        {mode !== 'change-password' && (
                            <div className="modal-field">
                                <div className="login-pass-labelrow">
                                    <label htmlFor="login-password">Contraseña</label>
                                    {mode === 'login' && (
                                        <span className="login-pass-hint">
                                            Por defecto: tu número
                                        </span>
                                    )}
                                </div>
                                <div className="login-pass-wrap">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                    />
                                    <button
                                        type="button"
                                        className="login-pass-toggle"
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword
                                            ? <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                            : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        }
                                    </button>
                                </div>
                                {mode === 'register' && (
                                    <p className="login-pass-info">
                                        Tu contraseña por defecto es tu número de celular. Puedes cambiarla aquí o después desde tu perfil.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Nueva contraseña — solo change-password */}
                        {mode === 'change-password' && (
                            <>
                                <div className="modal-field">
                                    <label htmlFor="new-password">Nueva contraseña</label>
                                    <div className="login-pass-wrap">
                                        <input
                                            id="new-password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Mínimo 6 caracteres"
                                            value={newPassword}
                                            onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                                            autoComplete="new-password"
                                        />
                                        <button type="button" className="login-pass-toggle" onClick={() => setShowPassword(v => !v)}>
                                            {showPassword
                                                ? <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                                : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-field">
                                    <label htmlFor="confirm-password">Confirmar contraseña</label>
                                    <input
                                        id="confirm-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Repite la contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </>
                        )}

                        {error && <p className="login-error" role="alert">{error}</p>}

                        <button type="submit" className="modal-submit" disabled={loading}>
                            {loading ? 'Cargando...'
                                : mode === 'login' ? 'Ingresar'
                                : mode === 'register' ? 'Crear cuenta'
                                : 'Guardar contraseña'}
                        </button>

                        {mode === 'login' && (
                            <p className="login-switch">
                                ¿No tienes cuenta?{' '}
                                <button type="button" className="login-switch-btn" onClick={() => switchMode('register')}>
                                    Regístrate gratis
                                </button>
                            </p>
                        )}

                        {mode === 'register' && (
                            <p className="login-switch">
                                ¿Ya tienes cuenta?{' '}
                                <button type="button" className="login-switch-btn" onClick={() => switchMode('login')}>
                                    Inicia sesión
                                </button>
                            </p>
                        )}

                    </form>
                )}
            </div>
        </div>
    );
}
