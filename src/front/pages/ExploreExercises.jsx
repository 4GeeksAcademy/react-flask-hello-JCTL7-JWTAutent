import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AddToRoutineModal from '../components/AddToRoutineModal';

export default function ExploreExercises() {
  const [searchParams] = useSearchParams();
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("chest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const navigate = useNavigate();

  // Lista de categorías populares con valores que coinciden con la BD
  const categories = [
    { name: "Pecho", value: "chest" },
    { name: "Espalda", value: "back" },
    { name: "Piernas", value: "legs" },
    { name: "Hombros", value: "shoulders" },
    { name: "Brazos", value: "arms" },
    { name: "Abdominales", value: "abdominals" }, // cambiado de "abs" a "abdominals"
    { name: "Cardio", value: "cardio" }
  ];

  const fetchExercises = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/exercises?search=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      const data = await res.json();
      setExercises(data);
    } catch (err) {
      console.error("Error cargando ejercicios", err);
      setError("No se pudieron cargar los ejercicios. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get("search") || "chest";
    setSearch(query);
    fetchExercises(query);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    fetchExercises(search.trim());
  };

  const handleCategoryClick = (categoryValue) => {
    setSearch(categoryValue);
    fetchExercises(categoryValue);
    navigate(`/explore?search=${categoryValue}`, { replace: true });
  };

  return (
    <div className="container page-container">
      <div className="mb-4">
        <h2 className="fw-bold">Explorar ejercicios</h2>
        <p className="text-muted">Busca ejercicios por músculo o nombre, o selecciona una categoría popular.</p>
      </div>

      {/* Categorías populares */}
      <div className="mb-4">
        <h5 className="mb-3">Categorías populares</h5>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`btn ${search === cat.value ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => handleCategoryClick(cat.value)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="row g-2 mb-5">
        <div className="col-md-10">
          <input
            className="form-control"
            placeholder="Ej: chest, legs, back..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border text-dark" />
          <p className="mt-3">Cargando ejercicios...</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {!loading && !error && exercises.length === 0 && (
        <p className="text-muted text-center">No se encontraron ejercicios.</p>
      )}

      {!loading && !error && exercises.length > 0 && (
        <div className="row g-4">
          {exercises.map((ex) => (
            <div key={ex.id} className="col-md-3">
              <div className="exercise-card">
                <img
                  src={ex.gifUrl || "https://via.placeholder.com/300x200?text=No+GIF"}
                  alt={ex.name}
                  className="exercise-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=No+GIF";
                  }}
                />
                <div className="exercise-body">
                  <h6 className="exercise-title">{ex.name}</h6>
                  <p className="exercise-info">Músculo: {ex.target}</p>
                  <p className="exercise-info">Equipo: {ex.equipment}</p>
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/exercise/${ex.id}`)}
                    >
                      Ver detalles
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setSelectedExercise({ id: ex.id, name: ex.name });
                        setModalOpen(true);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddToRoutineModal
        show={modalOpen}
        onClose={(success) => {
          setModalOpen(false);
          setSelectedExercise(null);
          if (success) {
            // Opcional: mostrar notificación
          }
        }}
        exerciseId={selectedExercise?.id}
        exerciseName={selectedExercise?.name}
      />
    </div>
  );
}