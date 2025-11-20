import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import { useAuth } from './useAuth';

type LoginFormState = {
  usernameOrEmail: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginFormState, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginFormState>({ usernameOrEmail: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGlobalError(null);
  };

  const validate = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!form.usernameOrEmail) {
      newErrors.usernameOrEmail = 'El correo es obligatorio.';
    } else if (!emailRegex.test(form.usernameOrEmail)) {
      newErrors.usernameOrEmail = 'Ingresa un correo válido.';
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setGlobalError(null);
      const resp = await authService.login(form);
      login(resp.accessToken, resp.user);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error(error);
      setGlobalError('No fue posible iniciar sesión. Verifica tus credenciales.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Ingreso al sistema</h1>
        <p className="login-subtitle">Autentícate con tus credenciales institucionales.</p>

        {globalError && (
          <div className="badge badge-danger" style={{ marginBottom: '16px', display: 'block' }}>
            {globalError}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="usernameOrEmail">Correo institucional</label>
            <div className="field-with-bubble">
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="usernameOrEmail"
                value={form.usernameOrEmail}
                onChange={handleChange}
                autoComplete="username"
                className={errors.usernameOrEmail ? 'input error' : 'input'}
              />
              {errors.usernameOrEmail && <div className="error-bubble">{errors.usernameOrEmail}</div>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <div className="field-with-bubble">
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className={errors.password ? 'input error' : 'input'}
              />
              {errors.password && <div className="error-bubble">{errors.password}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};
