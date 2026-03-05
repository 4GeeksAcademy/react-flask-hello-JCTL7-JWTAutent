import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function Goals() {

  const { store } = useGlobalReducer();

  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(1);

  const [loading, setLoading] = useState(true);

  // =========================
  // GET GOALS
  // =========================

  const fetchGoals = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/goals`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`
          }
        }
      );

      const data = await res.json();

      setGoals(data);

    } catch (error) {
      console.error("Error cargando metas:", error);
    }

    setLoading(false);
  };

  useEffect(() => {

    if (store.token) {
      fetchGoals();
    }

  }, [store.token]);

  // =========================
  // CREATE GOAL
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!store.token) {
      alert("Debes iniciar sesión para crear metas");
      return;
    }

    if (!title) return;

    try {

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/goals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.token}`
          },
          body: JSON.stringify({
            title,
            target: Number(target)
          })
        }
      );

      if (!res.ok) {
        const error = await res.json();
        console.error("Error creando meta:", error);
        return;
      }

      setTitle("");
      setTarget(1);

      fetchGoals();

    } catch (error) {
      console.error(error);
    }

  };

  // =========================
  // BLOQUEO SI NO HAY LOGIN
  // =========================

  if (!store.token) {

    return (
      <div className="container page-container text-center">

        <h2 className="fw-bold mb-3">
          Mis Metas
        </h2>

        <p className="text-muted mb-4">
          Para crear metas necesitas iniciar sesión.
        </p>

        <div className="d-flex justify-content-center gap-3">

          <Link to="/login" className="btn btn-dark">
            Iniciar sesión
          </Link>

          <Link to="/signup" className="btn btn-outline-dark">
            Crear cuenta
          </Link>

        </div>

      </div>
    );

  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="container page-container">

      <h2 className="mb-4 fw-bold">
        Mis Metas
      </h2>

      {/* CREATE GOAL */}

      <div className="card shadow-sm border-0 p-4 mb-5">

        <h5 className="mb-3">
          Crear nueva meta
        </h5>

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

            <button className="btn btn-dark w-100">
              Crear meta
            </button>

          </div>

        </form>

      </div>

      {/* GOALS LIST */}

      {loading ? (

        <div className="text-center mt-5">
          <div className="spinner-border text-dark" />
        </div>

      ) : goals.length === 0 ? (

        <p className="text-muted">
          Aún no has creado metas.
        </p>

      ) : (

        <div className="row g-4">

          {goals.map(goal => {

            const progressPercent =
              (goal.progress / goal.target) * 100;

            return (

              <div key={goal.id} className="col-md-4">

                <div className="card shadow-sm border-0 p-4 h-100">

                  <h5 className="fw-bold">
                    {goal.title}
                  </h5>

                  <p className="text-muted small">
                    Progreso: {goal.progress} / {goal.target}
                  </p>

                  <div className="progress">

                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${progressPercent}%`
                      }}
                    />

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}