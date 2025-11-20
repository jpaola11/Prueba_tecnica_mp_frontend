import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { caseStatusService, CaseStatusDto } from '../../api/case-status.service';

export const CaseStatusDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<CaseStatusDto | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await caseStatusService.findOne(Number(id));
        setStatus(data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [id]);

  return (
    <AppLayout sectionTitle="Detalle de estado de caso">
      <div className="card">
        <div className="card-header">
          <h1>{status?.name ?? 'Estado de caso'}</h1>
          <p className="page-subtitle">Información detallada del estado.</p>
        </div>
        <div className="card-body grid grid-2">
          <div>
            <h3>Código</h3>
            <p>{status?.code ?? '—'}</p>
          </div>
          <div>
            <h3>Final</h3>
            <p>{status?.isFinal ? 'Sí' : 'No'}</p>
          </div>
          <div>
            <h3>Predeterminado</h3>
            <p>{status?.isDefault ? 'Sí' : 'No'}</p>
          </div>
          <div className="grid-span-2">
            <h3>Descripción</h3>
            <p>{status?.description || 'Sin descripción.'}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
