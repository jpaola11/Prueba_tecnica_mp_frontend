import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { userService, UserDto } from '../api/user.service';

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await userService.findOne(Number(id));
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [id]);

  return (
    <AppLayout sectionTitle="Detalle de usuario">
      <div className="card">
        <div className="card-header">
          <h1>{user?.fullName ?? 'Usuario'}</h1>
          <p className="page-subtitle">Información detallada del usuario.</p>
        </div>
        <div className="card-body grid grid-2">
          <div>
            <h3>Usuario</h3>
            <p>{user?.username ?? '—'}</p>
          </div>
          <div>
            <h3>Correo</h3>
            <p>{user?.email ?? '—'}</p>
          </div>
          <div>
            <h3>Unidad organizacional</h3>
            <p>{user?.orgUnitName ?? '—'}</p>
          </div>
          <div>
            <h3>Rol</h3>
            <p>{user?.roleName ?? '—'}</p>
          </div>
          <div>
            <h3>Estado</h3>
            <p>{user?.isActive ? 'Activo' : 'Inactivo'}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
