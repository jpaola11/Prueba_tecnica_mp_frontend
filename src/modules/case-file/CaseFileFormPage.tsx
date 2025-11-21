import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { orgUnitService, OrgUnitDto } from '../../api/org-unit.service';
import {
  caseFileService,
  CaseFileDto,
  CreateCaseFileDto as CreateCaseFileInput,
  UpdateCaseFileDto,
} from '../../api/case-file.service';

type CaseFileForm = CreateCaseFileInput & {
  isActive: boolean;
};

type CaseFileFormErrors = Partial<Record<keyof CaseFileForm, string>>;

export const CaseFileFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<CaseFileForm>({
    code: '',
    title: '',
    description: '',
    orgUnitId: undefined,
    technicianId: 0 as unknown as number, 
    statusId: 0 as unknown as number,     
    openDate: '',
    referenceExternal: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<CaseFileFormErrors>({});
  const [loading, setLoading] = useState(false);

  // Catálogo de dependencias
  const [dependencies, setDependencies] = useState<OrgUnitDto[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);

  // Cargar catálogos
  useEffect(() => {
    const loadCatalogs = async () => {
      setCatalogLoading(true);
      try {
        const orgUnitsData = await orgUnitService.list();
        setDependencies(orgUnitsData);
      } catch (error) {
        console.error('Error cargando catálogo de dependencias', error);
      } finally {
        setCatalogLoading(false);
      }
    };

    loadCatalogs();
  }, []);

  const normalizeDateForInput = (iso?: string | null): string => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  // Cargar expediente en edición
  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const data: CaseFileDto = await caseFileService.findOne(Number(id));
        setForm({
          code: data.code,
          title: data.title,
          description: data.description ?? '',
          orgUnitId: data.orgUnitId ?? undefined,
          technicianId: data.technicianId,
          statusId: data.statusId,
          openDate: normalizeDateForInput(data.openDate),
          referenceExternal: data.referenceExternal ?? '',
          isActive: data.isActive,
        });
      } catch (error) {
        console.error('Error cargando expediente', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'isActive') {
      setForm((prev) => ({
        ...prev,
        isActive: value === 'true',
      }));
      return;
    }

    const numericFields = ['orgUnitId', 'technicianId', 'statusId'];

    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value
          ? Number(value)
          : undefined
        : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: CaseFileFormErrors = {};

    if (!form.code) newErrors.code = 'El código de expediente es obligatorio.';
    if (!form.title) newErrors.title = 'El título es obligatorio.';
    if (!form.technicianId || form.technicianId <= 0) {
      newErrors.technicianId = 'Debe asignarse un técnico válido.';
    }
    if (!form.statusId || form.statusId <= 0) {
      newErrors.statusId = 'Debe seleccionarse un estado inicial válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        const payload: UpdateCaseFileDto = {
          code: form.code,
          title: form.title,
          description: form.description,
          orgUnitId: form.orgUnitId,
          technicianId: form.technicianId,
          statusId: form.statusId,
          openDate: form.openDate || undefined,
          referenceExternal: form.referenceExternal,
          isActive: form.isActive,
        };
        await caseFileService.update(Number(id), payload);
      } else {
        const payload: CreateCaseFileInput = {
          code: form.code,
          title: form.title,
          description: form.description || undefined,
          orgUnitId: form.orgUnitId,
          technicianId: form.technicianId,
          statusId: form.statusId,
          openDate: form.openDate || undefined,
          referenceExternal: form.referenceExternal || undefined,
        };
        await caseFileService.create(payload);
      }
      navigate('/case-files');
    } catch (error) {
      console.error(error);
      alert('No fue posible guardar el expediente.');
    }
  };

  const handleCancel = () => {
    navigate('/case-files');
  };

  return (
    <AppLayout sectionTitle={isEdit ? 'Editar expediente' : 'Nuevo expediente'}>
      <div className="card">
        <div className="card-header">
          <h1>{isEdit ? 'Editar expediente' : 'Crear expediente'}</h1>
          <p className="page-subtitle">
            Define la información básica del expediente.
          </p>
        </div>
        <form className="card-body grid grid-2" onSubmit={handleSubmit}>
          {loading ? (
            <div>Cargando…</div>
          ) : (
            <>
              <div className="form-field">
                <label htmlFor="code">Código de expediente</label>
                <input
                  id="code"
                  name="code"
                  className={errors.code ? 'input error' : 'input'}
                  value={form.code}
                  onChange={handleChange}
                />
                {errors.code && (
                  <div className="error-bubble">{errors.code}</div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="title">Título</label>
                <input
                  id="title"
                  name="title"
                  className={errors.title ? 'input error' : 'input'}
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <div className="error-bubble">{errors.title}</div>
                )}
              </div>

              <div className="form-field grid-span-2">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className={errors.description ? 'input error' : 'input'}
                  value={form.description ?? ''}
                  onChange={handleChange}
                />
                {errors.description && (
                  <div className="error-bubble">{errors.description}</div>
                )}
              </div>

              {/* Dependencia (OrgUnit) */}
              <div className="form-field">
                <label htmlFor="orgUnitId">
                  Dependencia
                  {catalogLoading && (
                    <span style={{ marginLeft: 8, fontSize: 12 }}>
                      (cargando…)
                    </span>
                  )}
                </label>
                <select
                  id="orgUnitId"
                  name="orgUnitId"
                  className="input"
                  value={form.orgUnitId ?? ''}
                  onChange={handleChange}
                  disabled={catalogLoading}
                >
                  <option value="">— Seleccione —</option>
                  {dependencies.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Técnico (por ahora ID numérico) */}
              <div className="form-field">
                <label htmlFor="technicianId">Técnico (ID)</label>
                <input
                  id="technicianId"
                  name="technicianId"
                  type="number"
                  className={errors.technicianId ? 'input error' : 'input'}
                  value={form.technicianId ?? ''}
                  onChange={handleChange}
                />
                {errors.technicianId && (
                  <div className="error-bubble">{errors.technicianId}</div>
                )}
              </div>

              {/* Estado inicial (por ahora ID numérico) */}
              <div className="form-field">
                <label htmlFor="statusId">Estado inicial (ID)</label>
                <input
                  id="statusId"
                  name="statusId"
                  type="number"
                  className={errors.statusId ? 'input error' : 'input'}
                  value={form.statusId ?? ''}
                  onChange={handleChange}
                />
                {errors.statusId && (
                  <div className="error-bubble">{errors.statusId}</div>
                )}
              </div>

              {/* Fecha de apertura */}
              <div className="form-field">
                <label htmlFor="openDate">Fecha de apertura</label>
                <input
                  id="openDate"
                  name="openDate"
                  type="date"
                  className="input"
                  value={form.openDate ?? ''}
                  onChange={handleChange}
                />
              </div>

              {/* Referencia externa */}
              <div className="form-field">
                <label htmlFor="referenceExternal">Referencia externa</label>
                <input
                  id="referenceExternal"
                  name="referenceExternal"
                  className="input"
                  value={form.referenceExternal ?? ''}
                  onChange={handleChange}
                />
              </div>

              {/* Estado */}
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
