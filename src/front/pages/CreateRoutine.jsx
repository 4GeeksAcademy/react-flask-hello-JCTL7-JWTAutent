import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function CreateRoutine() {

  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [style, setStyle] = useState("strength");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/routines`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.token}`
          },
          body: JSON.stringify({
            title,
            description,
            difficulty,
            style
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Error creando rutina");
        setLoading(false);
        return;
      }

      navigate("/routines");

    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }

    setLoading(false);
  };

  return (

    <div className="container page-container">

      <div className="row justify-content-center">

        <div className="col-lg-6">

          <div className="card shadow-lg border-0 p-4">

            <h2 className="text-center mb-4">
              Crear Nueva Rutina
            </h2>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* TITLE */}

              <div className="mb-3">

                <label className="form-label">
                  Título
                </label>

                <input
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Rutina Full Body"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="mb-3">

                <label className="form-label">
                  Descripción
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe los ejercicios..."
                  required
                />

              </div>

              {/* DIFFICULTY */}

              <div className="mb-3">

                <label className="form-label">
                  Dificultad
                </label>

                <select
                  className="form-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>

              </div>

              {/* STYLE */}

              <div className="mb-4">

                <label className="form-label">
                  Tipo de entrenamiento
                </label>

                <select
                  className="form-select"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="strength">Fuerza</option>
                  <option value="cardio">Cardio</option>
                  <option value="hiit">HIIT</option>
                  <option value="mobility">Movilidad</option>
                </select>

              </div>

              {/* BUTTON */}

              <button
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Rutina"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}