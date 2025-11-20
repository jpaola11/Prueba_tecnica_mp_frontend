import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { orgUnitService, OrgUnitDto } from '../../api/org-unit.service';

export const OrgUnitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [unit, setUnit] = useState<OrgUnitDto | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await orgUnitService.findOne(Number(id));
        setUnit(data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [id]);

  return (
    <AppLayout sectionTitle="Detalle de unidad organizacional">
      <div className="card">
        <div className="card-header">
          <h1>{unit?.name ?? 'Unidad organizacional'}</h1>
          <p className="page-subtitle">Información detallada de la unidad.</p>
        </div>
        <div className="card-body grid grid-2">
          <div>
            <h3>Código</h3>
            <p>{unit?.code ?? '—'}</p>
          </div>
          <div>
            <h3>Unidad padre</h3>
            <p>{unit?.parentName ?? '—'}</p>
          </div>
          <div>
            <h3>Estado</h3>
            <p>{unit?.isActive ? 'Activa' : 'Inactiva'}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
