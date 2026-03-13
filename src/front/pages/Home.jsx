import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function Home() {
  const [exercises, setExercises] = useState([]);
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exercises?search=chest`)
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .catch((err) => console.error(err));
  }, []);

  const goToPrivate = (path) => {
    if (!store.token) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">
                Tu Gimnasio Virtual <br /> Siempre Contigo
              </h1>
              <p className="hero-subtitle">
                Accede a rutinas, crea entrenamientos y alcanza tus metas
                fitness.
              </p>
              <div className="hero-buttons">
                <Link to="/signup" className="btn btn-light btn-lg fw-semibold">
                  Comenzar Gratis →
                </Link>
                <Link to="/explore" className="btn btn-outline-light btn-lg">
                  Explorar ejercicios
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
                className="hero-image img-fluid"
                alt="Hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* EJERCICIOS POPULARES */}
      <section className="exercise-section">
        <div className="container">
          <h2 className="section-title">Ejercicios populares</h2>
          <div className="row g-4">
            {exercises.slice(0, 8).map((ex, index) => (
              <div key={index} className="col-md-3">
                <div className="exercise-card">
                  <img
                    src={ex.gifUrl || "https://via.placeholder.com/300x200?text=Ejercicio"}
                    className="exercise-image"
                    alt={ex.name}
                  />
                  <div className="exercise-body">
                    <h6 className="exercise-title">{ex.name}</h6>
                    <p className="exercise-info">Músculo: {ex.target}</p>
                    <p className="exercise-info">Equipo: {ex.equipment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="container text-center">
          <h2 className="section-title">Cómo funciona</h2>
          <div className="row mt-5 g-4">
            <div className="col-md-4">
              <div
                className="card shadow-sm p-4 h-100"
                onClick={() => navigate("/explore")}
                style={{ cursor: "pointer" }}
              >
                <h4 className="step-title">Explora ejercicios</h4>
                <p className="step-text">
                  Descubre ejercicios para cada grupo muscular.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card shadow-sm p-4 h-100"
                onClick={() => goToPrivate("/create-routine")}
                style={{ cursor: "pointer" }}
              >
                <h4 className="step-title">Crea tus rutinas</h4>
                <p className="step-text">
                  Diseña entrenamientos personalizados.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card shadow-sm p-4 h-100"
                onClick={() => goToPrivate("/goals")}
                style={{ cursor: "pointer" }}
              >
                <h4 className="step-title">Cumple tus metas</h4>
                <p className="step-text">
                  Registra tu progreso y gana puntos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}