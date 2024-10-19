
import React from 'react';
import useUsers from '../getBackend/users';

export default function AdminPage() {
  const { data, loading, error } = useUsers();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Página de Admin</h1>
      <p>Bem-vindo, Admin! Aqui podes gerir o sistema.</p>
      <p>123</p>

      <div style={{ padding: "50px" }}>
        <table>
          <thead>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <th>{d.id}</th>
                <th>{d.nome}</th>
                <th>{d.email}</th>
                <th>{d.role}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
