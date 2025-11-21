import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { roleService, RoleDto } from '../../api/role.service';

export const RoleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<RoleDto | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await roleService.findOne(Number(id));
        setRole(data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [id]);

  return (
    <AppLayout sectionTitle="Detalle de rol">
      <div className="card">
        <div className="card-header">
          <h1>{role?.name ?? 'Rol'}</h1>
          <p className="page-subtitle">Información detallada del rol.</p>
        </div>
        <div className="card-body grid grid-2">
          <div>
            <h3>Código</h3>
            <p>{role?.code ?? '—'}</p>
          </div>
          <div>
            <h3>Predeterminado</h3>
            <p>{role?.isDefault ? 'Sí' : 'No'}</p>
          </div>
          <div className="grid-span-2">
            <h3>Descripción</h3>
            <p>{role?.description || 'Sin descripción.'}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
