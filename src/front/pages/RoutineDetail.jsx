import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function RoutineDetail() {
  const { id } = useParams();
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =========================
  // LOAD ROUTINE
  // =========================

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/routines/${id}`)
      .then(res => res.json())
      .then(data => setRoutine(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // =========================
  // COMPLETE ROUTINE
  // =========================

  const completeRoutine = async () => {
    if (!store.token) {
      setMessage("Debes iniciar sesión para completar rutinas.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/routines/${id}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Error completando rutina");
        return;
      }

      setMessage(`🔥 Rutina completada! +${data.points_earned} puntos`);
    } catch (error) {
      console.error(error);
      setMessage("Error del servidor");
    }
  };

  // =========================
  // UI STATES
  // =========================

  if (loading) {
    return (
      <div className="container page-container text-center">
        <div className="spinner-border text-dark"></div>
        <p className="mt-3">Cargando rutina...</p>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="container page-container text-center">
        <h3>Rutina no encontrada</h3>
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="container page-container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <h2 className="fw-bold mb-3">{routine.title}</h2>
            <p className="text-muted">{routine.description}</p>

            <div className="mb-3">
              <span className="badge bg-secondary me-2">
                {routine.difficulty || "General"}
              </span>
              <span className="badge bg-dark">{routine.style || "Workout"}</span>
            </div>

            <hr />

            <h5 className="mb-3">Ejercicios sugeridos</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <button
                className="btn btn-outline-dark"
                onClick={() => navigate("/explore?search=push")}
              >
                Push Ups
              </button>
              <button
                className="btn btn-outline-dark"
                onClick={() => navigate("/explore?search=squat")}
              >
                Squats
              </button>
              <button
                className="btn btn-outline-dark"
                onClick={() => navigate("/explore?search=plank")}
              >
                Plank
              </button>
              <button
                className="btn btn-outline-dark"
                onClick={() => navigate("/explore?search=pull")}
              >
                Pull Ups
              </button>
            </div>

            <button className="btn btn-success" onClick={completeRoutine}>
              Completar rutina
            </button>

            {message && (
              <div className="alert alert-info mt-3">{message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
