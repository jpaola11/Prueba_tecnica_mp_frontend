import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { caseStatusService, CaseStatusDto, CreateCaseStatusDto } from '../../api/case-status.service';

type CaseStatusForm = CreateCaseStatusDto;
type CaseStatusFormErrors = Partial<Record<keyof CaseStatusForm, string>>;

export const CaseStatusFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<CaseStatusForm>({
    code: '',
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState<CaseStatusFormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const data: CaseStatusDto = await caseStatusService.findOne(Number(id));
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
    const { name, value, type, checked } = e.target as any;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: CaseStatusFormErrors = {};
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
        await caseStatusService.update(Number(id), form);
      } else {
        await caseStatusService.create(form);
      }
      navigate('/case-status');
    } catch (error) {
      console.error(error);
      alert('No fue posible guardar el estado.');
    }
  };

  const handleCancel = () => {
    navigate('/case-status');
  };

  return (
    <AppLayout sectionTitle={isEdit ? 'Editar estado de caso' : 'Nuevo estado de caso'}>
      <div className="card">
        <div className="card-header">
          <h1>{isEdit ? 'Editar estado de caso' : 'Crear estado de caso'}</h1>
          <p className="page-subtitle">Define los estados posibles para los expedientes.</p>
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

              <div className="form-field grid-span-2">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="textarea"
                  value={form.description}
                  onChange={handleChange}
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
