import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { evidenceService, EvidenceDto, CreateEvidenceDto } from '../../api/evidence.service';

type EvidenceForm = CreateEvidenceDto & { caseCode?: string };
type EvidenceFormErrors = Partial<Record<keyof EvidenceForm, string>>;

export const EvidenceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<EvidenceForm>({
    caseFileId: 0,
    type: '',
    description: '',
    location: '',
    fileUrl: '',
    caseCode: '',
  });

  const [errors, setErrors] = useState<EvidenceFormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const data: EvidenceDto = await evidenceService.findOne(Number(id));
        setForm({
          caseFileId: data.caseFileId,
          type: data.type,
          description: data.description ?? '',
          location: data.location ?? '',
          fileUrl: data.fileUrl ?? '',
          caseCode: data.caseCode,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'caseFileId'
          ? value
            ? Number(value)
            : 0
          : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: EvidenceFormErrors = {};
    if (!form.caseFileId) newErrors.caseFileId = 'El expediente es obligatorio.';
    if (!form.type) newErrors.type = 'El tipo de evidencia es obligatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const { caseCode, ...payload } = form;
      if (isEdit) {
        await evidenceService.update(Number(id), payload);
      } else {
        await evidenceService.create(payload);
      }
      navigate('/evidence');
    } catch (error) {
      console.error(error);
      alert('No fue posible guardar la evidencia.');
    }
  };

  const handleCancel = () => {
    navigate('/evidence');
  };

  return (
    <AppLayout sectionTitle={isEdit ? 'Editar evidencia' : 'Nueva evidencia'}>
      <div className="card">
        <div className="card-header">
          <h1>{isEdit ? 'Editar evidencia' : 'Registrar evidencia'}</h1>
          <p className="page-subtitle">Registra o actualiza la evidencia de un expediente.</p>
        </div>
        <form className="card-body grid grid-2" onSubmit={handleSubmit}>
          {loading ? (
            <div>Cargando…</div>
          ) : (
            <>
              <div className="form-field">
                <label htmlFor="caseFileId">ID de expediente</label>
                <input
                  id="caseFileId"
                  name="caseFileId"
                  className={errors.caseFileId ? 'input error' : 'input'}
                  value={form.caseFileId || ''}
                  onChange={handleChange}
                />
                {errors.caseFileId && <div className="error-bubble">{errors.caseFileId}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="type">Tipo de evidencia</label>
                <input
                  id="type"
                  name="type"
                  className={errors.type ? 'input error' : 'input'}
                  value={form.type}
                  onChange={handleChange}
                />
                {errors.type && <div className="error-bubble">{errors.type}</div>}
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

              <div className="form-field">
                <label htmlFor="location">Ubicación</label>
                <input
                  id="location"
                  name="location"
                  className="input"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="fileUrl">URL de archivo</label>
                <input
                  id="fileUrl"
                  name="fileUrl"
                  className="input"
                  value={form.fileUrl}
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
