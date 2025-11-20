import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { userService, CreateUserDto, UserDto } from '../../api/user.service';

type UserForm = CreateUserDto;
type UserFormErrors = Partial<Record<keyof UserForm | 'passwordConfirm', string>>;

export const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<UserForm>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    orgUnitId: undefined,
    roleId: undefined,
    isActive: true,
  });

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const data: UserDto = await userService.findOne(Number(id));
        setForm({
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          password: '',
          orgUnitId: data.orgUnitId ?? undefined,
          roleId: data.roleId ?? undefined,
          isActive: data.isActive,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'isActive') {
      setForm((prev) => ({
        ...prev,
        isActive: value === 'true',
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'orgUnitId' || name === 'roleId'
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: UserFormErrors = {};
    if (!form.username) newErrors.username = 'El usuario es obligatorio.';
    if (!form.fullName) newErrors.fullName = 'El nombre completo es obligatorio.';
    if (!form.email) newErrors.email = 'El correo es obligatorio.';

    if (!isEdit) {
      if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
      if (form.password !== passwordConfirm) {
        newErrors.passwordConfirm = 'Las contraseñas no coinciden.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        const { password, ...rest } = form;
        await userService.update(Number(id), password ? form : rest);
      } else {
        await userService.create(form);
      }
      navigate('/users');
    } catch (error) {
      console.error(error);
      alert('No fue posible guardar el usuario.');
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <AppLayout sectionTitle={isEdit ? 'Editar usuario' : 'Nuevo usuario'}>
      <div className="card">
        <div className="card-header">
          <h1>{isEdit ? 'Editar usuario' : 'Crear usuario'}</h1>
          <p className="page-subtitle">Define la información del usuario.</p>
        </div>
        <form className="card-body grid grid-2" onSubmit={handleSubmit}>
          {loading ? (
            <div>Cargando…</div>
          ) : (
            <>
              <div className="form-field">
                <label htmlFor="username">Usuario</label>
                <input
                  id="username"
                  name="username"
                  className={errors.username ? 'input error' : 'input'}
                  value={form.username}
                  onChange={handleChange}
                />
                {errors.username && <div className="error-bubble">{errors.username}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="fullName">Nombre completo</label>
                <input
                  id="fullName"
                  name="fullName"
                  className={errors.fullName ? 'input error' : 'input'}
                  value={form.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="error-bubble">{errors.fullName}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="email">Correo</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={errors.email ? 'input error' : 'input'}
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="error-bubble">{errors.email}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="orgUnitId">Unidad organizacional</label>
                <select
                  id="orgUnitId"
                  name="orgUnitId"
                  className="input"
                  value={form.orgUnitId ?? ''}
                  onChange={handleChange}
                >
                  <option value="">— Seleccione —</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="roleId">Rol</label>
                <select
                  id="roleId"
                  name="roleId"
                  className="input"
                  value={form.roleId ?? ''}
                  onChange={handleChange}
                >
                  <option value="">— Seleccione —</option>
                </select>
              </div>

              {!isEdit && (
                <>
                  <div className="form-field">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className={errors.password ? 'input error' : 'input'}
                      value={form.password}
                      onChange={handleChange}
                    />
                    {errors.password && <div className="error-bubble">{errors.password}</div>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="passwordConfirm">Confirmar contraseña</label>
                    <input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      className={errors.passwordConfirm ? 'input error' : 'input'}
                      value={passwordConfirm}
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                        setErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
                      }}
                    />
                    {errors.passwordConfirm && (
                      <div className="error-bubble">{errors.passwordConfirm}</div>
                    )}
                  </div>
                </>
              )}

              <div className="form-field">
                <label htmlFor="isActive">Estado</label>
                <select
                  id="isActive"
                  name="isActive"
                  className="input"
                  value={form.isActive ? 'true' : 'false'}
                  onChange={handleChange}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <div className="form-actions grid-span-2">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </AppLayout>
  );
};
