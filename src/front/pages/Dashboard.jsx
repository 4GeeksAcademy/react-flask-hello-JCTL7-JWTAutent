import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function Dashboard() {
  const { store } = useGlobalReducer();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!store.token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${store.token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Error dashboard");
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [store.token]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status" />
        <p className="mt-3">Cargando dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mt-5 text-center">
        <p>No se pudo cargar la información.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* Header */}
      <div className="mb-5">
        <h2 className="fw-bold">
          Bienvenido, {data.user.email}
        </h2>
        <p className="text-muted">
          Aquí tienes un resumen de tu actividad.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 text-center p-4">
            <h6 className="text-muted">Puntos</h6>
            <h2 className="fw-bold text-primary">
              {data.user.points}
            </h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 text-center p-4">
            <h6 className="text-muted">Rutinas creadas</h6>
            <h2 className="fw-bold">
              {data.stats.total_routines}
            </h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 text-center p-4">
            <h6 className="text-muted">Entrenamientos</h6>
            <h2 className="fw-bold">
              {data.stats.total_training}
            </h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 text-center p-4">
            <h6 className="text-muted">Metas activas</h6>
            <h2 className="fw-bold text-success">
              {data.stats.active_goals}
            </h2>
          </div>
        </div>

      </div>

      {/* Activity Section */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="mb-4 fw-bold">Últimos entrenamientos</h5>

        {data.last_training.length === 0 ? (
          <p className="text-muted">
            Aún no has registrado entrenamientos.
          </p>
        ) : (
          <ul className="list-group list-group-flush">
            {data.last_training.map(log => (
              <li key={log.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  {log.routine?.title || "Rutina"}
                </span>
                <small className="text-muted">
                  {new Date(log.completed_at).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}