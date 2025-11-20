import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { orgUnitService, OrgUnitDto, CreateOrgUnitDto } from '../api/org-unit.service';

type OrgUnitForm = CreateOrgUnitDto;
type OrgUnitFormErrors = Partial<Record<keyof OrgUnitForm, string>>;

export const OrgUnitFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<OrgUnitForm>({
    code: '',
    name: '',
    parentId: undefined,
    isActive: true,
  });

  const [errors, setErrors] = useState<OrgUnitFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [allUnits, setAllUnits] = useState<OrgUnitDto[]>([]);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const data = await orgUnitService.list();
        setAllUnits(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadUnits();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const data: OrgUnitDto = await orgUnitService.findOne(Number(id));
        setForm({
          code: data.code,
          name: data.name,
          parentId: data.parentId ?? undefined,
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
      setForm((prev) => ({ ...prev, isActive: value === 'true' }));
    } else if (name === 'parentId') {
      setForm((prev) => ({
        ...prev,
        parentId: value ? Number(value) : undefined,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: OrgUnitFormErrors = {};
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
        await orgUnitService.update(Number(id), form);
      } else {
        await orgUnitService.create(form);
      }
      navigate('/org-units');
    } catch (error) {
      console.error(error);
      alert('No fue posible guardar la unidad.');
    }
  };

  const handleCancel = () => {
    navigate('/org-units');
  };

  return (
    <AppLayout sectionTitle={isEdit ? 'Editar unidad organizacional' : 'Nueva unidad organizacional'}>
      <div className="card">
        <div className="card-header">
          <h1>{isEdit ? 'Editar unidad' : 'Crear unidad'}</h1>
          <p className="page-subtitle">Define la estructura organizacional del sistema.</p>
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
                  className={errors.code ? 'input error' : 'input'}
                  value={form.code}
                  onChange={handleChange}
                />
                {errors.code && <div className="error-bubble">{errors.code}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  name="name"
                  className={errors.name ? 'input error' : 'input'}
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="error-bubble">{errors.name}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="parentId">Unidad padre</label>
                <select
                  id="parentId"
                  name="parentId"
                  className="input"
                  value={form.parentId ?? ''}
                  onChange={handleChange}
                >
                  <option value="">— Ninguna —</option>
                  {allUnits
                    .filter((u) => !isEdit || u.id !== Number(id))
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="isActive">Estado</label>
                <select
                  id="isActive"
                  name="isActive"
                  className="input"
                  value={form.isActive ? 'true' : 'false'}
                  onChange={handleChange}
                >
                  <option value="true">Activa</option>
                  <option value="false">Inactiva</option>
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
