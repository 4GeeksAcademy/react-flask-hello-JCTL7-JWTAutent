import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function Goals() {
  const { store } = useGlobalReducer();

  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState(null); // { id, title, target }
  const [showEditModal, setShowEditModal] = useState(false);

  // =========================
  // GET GOALS
  // =========================
  const fetchGoals = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/goals`, {
        headers: { Authorization: `Bearer ${store.token}` }
      });
      if (!res.ok) throw new Error("Error al cargar");
      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error("Error cargando metas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store.token) {
      fetchGoals();
    } else {
      setLoading(false);
    }
  }, [store.token]);

  // =========================
  // CREATE GOAL
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store.token || !title) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.token}`
        },
        body: JSON.stringify({ title, target: Number(target) })
      });
      if (!res.ok) throw new Error("Error creando meta");
      setTitle("");
      setTarget(1);
      fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // UPDATE GOAL
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingGoal) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/goals/${editingGoal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.token}`
        },
        body: JSON.stringify({
          title: editingGoal.title,
          target: editingGoal.target
        })
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setShowEditModal(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // DELETE GOAL
  // =========================
  const handleDelete = async (goalId) => {
    if (!window.confirm("¿Eliminar esta meta?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/goals/${goalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${store.token}` }
      });
      if (!res.ok) throw new Error("Error al eliminar");
      fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // COMPLETE GOAL
  // =========================
  const handleComplete = async (goalId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/goals/${goalId}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${store.token}` }
      });
      if (!res.ok) throw new Error("Error al completar");
      fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // RENDER (si no autenticado)
  // =========================
  if (!store.token) {
    return (
      <div className="container page-container text-center">
        <h2 className="fw-bold mb-3">Mis Metas</h2>
        <p className="text-muted mb-4">Para crear metas necesitas iniciar sesión.</p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/login" className="btn btn-dark">Iniciar sesión</Link>
          <Link to="/signup" className="btn btn-outline-dark">Crear cuenta</Link>
        </div>
      </div>
    );
  }

  // =========================
  // RENDER PRINCIPAL
  // =========================
  return (
    <div className="container page-container">
      <h2 className="mb-4 fw-bold">Mis Metas</h2>

      {/* Formulario de creación */}
      <div className="card shadow-sm border-0 p-4 mb-5">
        <h5 className="mb-3">Crear nueva meta</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Entrenar 3 veces por semana"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              min="1"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-dark w-100">Crear meta</button>
          </div>
        </form>
      </div>

      {/* Lista de metas */}
      {loading ? (
        <div className="text-center mt-5"><div className="spinner-border text-dark" /></div>
      ) : goals.length === 0 ? (
        <p className="text-muted">Aún no has creado metas.</p>
      ) : (
        <div className="row g-4">
          {goals.map(goal => {
            const progressPercent = (goal.progress / goal.target) * 100;
            return (
              <div key={goal.id} className="col-md-4">
                <div className="card shadow-sm border-0 p-4 h-100">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="fw-bold">{goal.title}</h5>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => {
                          setEditingGoal({ id: goal.id, title: goal.title, target: goal.target });
                          setShowEditModal(true);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger me-1"
                        onClick={() => handleDelete(goal.id)}
                      >
                        🗑
                      </button>
                      {!goal.completed && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleComplete(goal.id)}
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-muted small">
                    Progreso: {goal.progress} / {goal.target}
                  </p>
                  <div className="progress">
                    <div
                      className={`progress-bar ${goal.completed ? 'bg-success' : 'bg-primary'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  {goal.completed && (
                    <span className="badge bg-success mt-2">Completada</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de edición */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar meta</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingGoal?.title || ''}
                      onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Objetivo (target)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={editingGoal?.target || 1}
                      onChange={(e) => setEditingGoal({ ...editingGoal, target: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-dark">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
