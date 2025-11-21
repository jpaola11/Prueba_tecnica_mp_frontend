import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import {
  evidenceService,
  EvidenceDto,
  CreateEvidenceDto,
  UpdateEvidenceDto,
} from '../../api/evidence.service';

type EvidenceForm = CreateEvidenceDto & {
  caseCode?: string;     
  fileUrl?: string;      
};

type EvidenceFormErrors = Partial<Record<keyof EvidenceForm, string>>;

export const EvidenceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<EvidenceForm>({
    caseId: 0,
    seqNumber: 1,
    description: '',
    color: '',
    sizeText: '',
    weightValue: 0,
    weightUnit: '',
    location: '',
    technicianId: 0,
    observations: '',
    caseCode: '',
    fileUrl: '',
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
          caseId: data.caseId ?? 0,
          seqNumber: data.seqNumber ?? 1,
          description: data.description ?? '',
          color: data.color ?? '',
          sizeText: data.sizeText ?? '',
          weightValue: data.weightValue ?? 0,
          weightUnit: data.weightUnit ?? '',
          location: data.location ?? '',
          technicianId: data.technicianId ?? 0,
          observations: data.observations ?? '',
          caseCode: data.caseCode ?? '',
          fileUrl: data.fileUrl ?? '',
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
    const field = name as keyof EvidenceForm;

    const numericFields: Array<keyof EvidenceForm> = [
      'caseId',
      'seqNumber',
      'technicianId',
    ];

    setForm((prev) => ({
      ...prev,
      [field]: numericFields.includes(field)
        ? value
          ? Number(value)
          : 0
        : value,
    }));

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, file: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: EvidenceFormErrors = {};

    if (!form.caseId || form.caseId < 1) {
      newErrors.caseId = 'El expediente es obligatorio.';
    }
    if (!form.seqNumber || form.seqNumber < 1) {
      newErrors.seqNumber = 'El número secuencial es obligatorio y debe ser mayor a 0.';
    }
    if (!form.description.trim()) {
      newErrors.description = 'La descripción es obligatoria.';
    } else if (form.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres.';
    }
    if (!form.technicianId || form.technicianId < 1) {
      newErrors.technicianId = 'El técnico responsable es obligatorio.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        const { caseId, caseCode, fileUrl, ...rest } = form;
        const payload: UpdateEvidenceDto = { ...rest };
        await evidenceService.update(Number(id), payload);
      } else {
        const { caseCode, fileUrl, ...payload } = form;
        await evidenceService.create(payload);
      }

      navigate('/evidences');
    } catch (error) {
      console.error(error);
      alert('No fue posible guardar la evidencia.');
    }
  };

  const handleCancel = () => navigate('/evidences');

  return (
    <AppLayout sectionTitle={isEdit ? 'Editar evidencia' : 'Nueva evidencia'}>
      <div className="card">
        <div className="card-header">
          <h1>{isEdit ? 'Editar evidencia' : 'Registrar evidencia'}</h1>
          <p className="page-subtitle">
            Registra o actualiza la evidencia de un expediente.
          </p>
        </div>

        <form className="card-body grid grid-2" onSubmit={handleSubmit}>
          {loading ? (
            <div>Cargando…</div>
          ) : (
            <>
              {!!form.caseCode && (
                <div className="form-field grid-span-2">
                  <label>Código de expediente</label>
                  <input className="input" value={form.caseCode} disabled />
                </div>
              )}

              <div className="form-field">
                <label htmlFor="caseId">ID de expediente</label>
                <input
                  id="caseId"
                  name="caseId"
                  type="number"
                  min={1}
                  disabled={isEdit}
                  className={errors.caseId ? 'input error' : 'input'}
                  value={form.caseId || ''}
                  onChange={handleChange}
                />
                {errors.caseId && (
                  <div className="error-bubble">{errors.caseId}</div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="seqNumber"># Secuencial</label>
                <input
                  id="seqNumber"
                  name="seqNumber"
                  type="number"
                  min={1}
                  className={errors.seqNumber ? 'input error' : 'input'}
                  value={form.seqNumber || ''}
                  onChange={handleChange}
                />
                {errors.seqNumber && (
                  <div className="error-bubble">{errors.seqNumber}</div>
                )}
              </div>

              <div className="form-field grid-span-2">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className={errors.description ? 'textarea error' : 'textarea'}
                  value={form.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <div className="error-bubble">{errors.description}</div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="color">Color</label>
                <input
                  id="color"
                  name="color"
                  className="input"
                  value={form.color ?? ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="sizeText">Tamaño / Dimensiones</label>
                <input
                  id="sizeText"
                  name="sizeText"
                  className="input"
                  value={form.sizeText ?? ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="weightValue">Peso (valor)</label>
                <input
                  id="weightValue"
                  name="weightValue"
                  className="input"
                  value={form.weightValue ?? ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="weightUnit">Peso (unidad)</label>
                <input
                  id="weightUnit"
                  name="weightUnit"
                  className="input"
                  value={form.weightUnit ?? ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="location">Ubicación</label>
                <input
                  id="location"
                  name="location"
                  className="input"
                  value={form.location ?? ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="technicianId">ID del técnico</label>
                <input
                  id="technicianId"
                  name="technicianId"
                  type="number"
                  min={1}
                  className={errors.technicianId ? 'input error' : 'input'}
                  value={form.technicianId || ''}
                  onChange={handleChange}
                />
                {errors.technicianId && (
                  <div className="error-bubble">{errors.technicianId}</div>
                )}
              </div>

              <div className="form-field grid-span-2">
                <label htmlFor="observations">Observaciones</label>
                <textarea
                  id="observations"
                  name="observations"
                  rows={2}
                  className="textarea"
                  value={form.observations ?? ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field grid-span-2">
                <label htmlFor="file">Archivo (opcional)</label>

                {isEdit && form.fileUrl && (
                  <p className="text-sm mb-2">
                    Archivo actual:{' '}
                    <a href={form.fileUrl} target="_blank" rel="noreferrer">
                      abrir
                    </a>
                  </p>
                )}

                <input
                  id="file"
                  name="file"
                  type="file"
                  className="input"
                  onChange={handleFileChange}
                />
              </div>

              <div className="form-actions grid-span-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
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
