import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import AddToRoutineModal from "../components/AddToRoutineModal";

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store } = useGlobalReducer();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const fetchExercise = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exercises/${id}`);
      if (!res.ok) throw new Error("Ejercicio no encontrado");
      const data = await res.json();
      setExercise(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToRoutine = () => {
    if (!store.token) {
      navigate("/login");
      return;
    }
    setShowRoutineModal(true);
  };

  if (loading) {
    return (
      <div className="container page-container text-center">
        <div className="spinner-border text-dark" />
        <p className="mt-3">Cargando ejercicio...</p>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="container page-container text-center">
        <h3>Ejercicio no encontrado</h3>
        <button className="btn btn-dark mt-3" onClick={() => navigate("/explore")}>
          Volver a explorar
        </button>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <div className="row">
              <div className="col-md-6">
                <img
                  src={exercise.gifUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                  alt={exercise.name}
                  className="img-fluid rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
              </div>
              <div className="col-md-6">
                <h2 className="fw-bold mb-3">{exercise.name}</h2>
                <p className="mb-2">
                  <strong>Músculo objetivo:</strong> {exercise.target}
                </p>
                <p className="mb-2">
                  <strong>Equipo necesario:</strong> {exercise.equipment || "Ninguno"}
                </p>
                <p className="mb-2">
                  <strong>Tipo:</strong> {exercise.type || "General"}
                </p>
                <div className="mt-4">
                  <button className="btn btn-dark me-2" onClick={() => navigate("/explore")}>
                    ← Volver
                  </button>
                  <button className="btn btn-success" onClick={handleAddToRoutine}>
                    + Agregar a rutina
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar a rutina (puedes importar el componente existente) */}
      {showRoutineModal && (
        <AddToRoutineModal
          show={showRoutineModal}
          onClose={(success) => {
            setShowRoutineModal(false);
            if (success) {
              // Opcional: mostrar notificación
            }
          }}
          exerciseId={exercise.id}
          exerciseName={exercise.name}
        />
      )}
    </div>
  );
}