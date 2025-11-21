import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { evidenceService, EvidenceDto } from '../../api/evidence.service';

export const EvidenceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evidence, setEvidence] = useState<EvidenceDto | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await evidenceService.findOne(Number(id));
        setEvidence(data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [id]);

  return (
    <AppLayout sectionTitle="Detalle de evidencia">
      <div className="card">
        <div className="card-header">
          <h1>Evidencia de expediente {evidence?.caseCode ?? ''}</h1>
          <p className="page-subtitle">Información detallada de la evidencia.</p>
        </div>
        <div className="card-body grid grid-2">
          <div>
            <h3>Código de expediente</h3>
            <p>{evidence?.caseCode ?? '—'}</p>
          </div>
          <div>
            <h3>Tipo</h3>
            <p>{evidence?.type ?? '—'}</p>
          </div>
          <div className="grid-span-2">
            <h3>Descripción</h3>
            <p>{evidence?.description ?? '—'}</p>
          </div>
          <div>
            <h3>Ubicación</h3>
            <p>{evidence?.location ?? '—'}</p>
          </div>
          <div>
            <h3>Fecha de registro</h3>
            <p>{evidence?.createdAt ?? '—'}</p>
          </div>
          <div className="grid-span-2">
            <h3>Archivo</h3>
            {evidence?.fileUrl ? (
              <a href={evidence.fileUrl} target="_blank" rel="noreferrer">
                Ver archivo
              </a>
            ) : (
              <p>Sin archivo asociado.</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
