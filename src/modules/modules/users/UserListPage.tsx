import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { userService, UserDto, UserQueryDto } from '../../api/user.service';

export const UserListPage: React.FC = () => {
  const [filters, setFilters] = useState<UserQueryDto>({});
  const [rows, setRows] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async (query?: UserQueryDto) => {
    setLoading(true);
    try {
      const data = await userService.list(query ?? filters);
      setRows(data);
    } catch (error) {
      console.error(error);
      alert('No fue posible cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleSearch = () => {
    load();
  };

  const handleClear = () => {
    setFilters({});
    setRows([]);
  };

  const handleView = (id: number) => {
    navigate(`/users/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/users/${id}/editar`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Deseas eliminar este usuario?')) return;
    try {
      await userService.remove(id);
      setRows((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
      alert('No fue posible eliminar el usuario.');
    }
  };

  const handleCreate = () => {
    navigate('/users/nuevo');
  };

  return (
    <AppLayout sectionTitle="Usuarios">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p className="page-subtitle">Administración de usuarios del sistema.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleCreate}>
            Nuevo usuario
          </button>
        </div>
      </div>

      <section className="card filters-card">
        <div className="card-header">
          <h3>Filtros</h3>
        </div>
        <div className="card-body grid-4">
          <div className="form-field">
            <label htmlFor="search">Nombre / correo</label>
            <input
              id="search"
              name="search"
              className="input"
              value={filters.search ?? ''}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="orgUnitId">Unidad organizacional</label>
            <select
              id="orgUnitId"
              name="orgUnitId"
              className="input"
              value={filters.orgUnitId ?? ''}
              onChange={handleFilterChange}
            >
              <option value="">Todas</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="roleId">Rol</label>
            <select
              id="roleId"
              name="roleId"
              className="input"
              value={filters.roleId ?? ''}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="isActive">Estado</label>
            <select
              id="isActive"
              name="isActive"
              className="input"
              value={
                typeof filters.isActive === 'boolean'
                  ? filters.isActive
                    ? 'true'
                    : 'false'
                  : ''
              }
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  isActive:
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true',
                }))
              }
            >
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div className="filter-actions grid-span-4">
            <button className="btn btn-secondary" type="button" onClick={handleClear}>
              Limpiar
            </button>
            <button className="btn btn-primary" type="button" onClick={handleSearch}>
              Buscar
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>Resultados</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div>Cargando…</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre completo</th>
                  <th>Correo</th>
                  <th>Unidad</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.orgUnitName ?? '—'}</td>
                    <td>{u.roleName ?? '—'}</td>
                    <td>
                      <span className={u.isActive ? 'badge badge-success' : 'badge badge-danger'}>
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="btn-table" onClick={() => handleView(u.id)}>
                        Ver
                      </button>
                      <button className="btn-table" onClick={() => handleEdit(u.id)}>
                        Editar
                      </button>
                      <button className="btn-table danger" onClick={() => handleDelete(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No hay usuarios para los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </AppLayout>
  );
};
