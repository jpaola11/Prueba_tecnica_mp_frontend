import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { roleService, CreateRoleDto, RoleDto } from '../../api/role.service';

type RoleForm = CreateRoleDto;
type RoleFormErrors = Partial<Record<keyof RoleForm, string>>;

export const RoleFormPage: React.FC = () => {
  const [form, setForm] = useState<RoleForm>({ code: '', name: '', description: '' });
  const [errors, setErrors] = useState<RoleFormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = !!id;

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const data: RoleDto = await roleService.findOne(Number(id));
        setForm({
          code: data.code,
          name: data.name,
          description: data.description ?? '',
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: RoleFormErrors = {};
    if (!form.code) newErrors.code = 'El código es obligatorio.';
    if (!form.name) newErrors.name = 'El nombre es obligatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        await roleService.update(Number(id), form);
      } else {
        await roleService.create(form);
      }
      navigate('/roles');
    } catch (error) {
      console.error(error);
      alert('No fue posible guardar el rol.');
    }
  };

  const handleCancel = () => {
    navigate('/roles');
  };

  return (
    <AppLayout sectionTitle={isEdit ? 'Editar rol' : 'Nuevo rol'}>
      <div className="card">
        <div className="card-header">
          <h1>{isEdit ? 'Editar rol' : 'Crear rol'}</h1>
          <p className="page-subtitle">Define el código y nombre del rol.</p>
        </div>
        <form className="card-body grid grid-2" onSubmit={handleSubmit}>
          {loading ? (
            <div>Cargando…</div>
          ) : (
            <>
              <div className="form-field">
                <label htmlFor="code">Código</label>
                <input
                  id="code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className={errors.code ? 'input error' : 'input'}
                />
                {errors.code && <div className="error-bubble">{errors.code}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? 'input error' : 'input'}
                />
                {errors.name && <div className="error-bubble">{errors.name}</div>}
              </div>

              <div className="form-field grid-span-2">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="textarea"
                />
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
