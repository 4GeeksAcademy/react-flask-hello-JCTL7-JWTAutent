import { useEffect, useState } from "react";

export default function ExploreExercises() {

  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("chest");
  const [loading, setLoading] = useState(true);

  const fetchExercises = async (query) => {

    setLoading(true);

    try {

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/exercises?search=${query}`
      );

      const data = await res.json();

      setExercises(data);

    } catch (error) {

      console.error("Error cargando ejercicios", error);

    }

    setLoading(false);
  };

  useEffect(() => {
    fetchExercises(search);
  }, []);

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!search) return;

    fetchExercises(search);

  };

  return (

    <div className="container page-container">

      {/* HEADER */}

      <div className="mb-4">

        <h2 className="fw-bold">
          Explorar ejercicios
        </h2>

        <p className="text-muted">
          Busca ejercicios por músculo o nombre.
        </p>

      </div>


      {/* SEARCH */}

      <form
        onSubmit={handleSubmit}
        className="row g-2 mb-5"
      >

        <div className="col-md-10">

          <input
            className="form-control"
            placeholder="Ej: chest, legs, back..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="col-md-2">

          <button className="btn btn-dark w-100">
            Buscar
          </button>

        </div>

      </form>


      {/* LOADING */}

      {loading ? (

        <div className="text-center mt-5">

          <div className="spinner-border text-dark"></div>

          <p className="mt-3">
            Cargando ejercicios...
          </p>

        </div>

      ) : exercises.length === 0 ? (

        <p className="text-muted">
          No se encontraron ejercicios.
        </p>

      ) : (

        <div className="row g-4">

          {exercises.map((ex, index) => (

            <div
              key={index}
              className="col-md-3"
            >

              <div className="exercise-card">

                <img
                  src={ex.gifUrl}
                  alt={ex.name}
                  className="exercise-image"
                />

                <div className="exercise-body">

                  <h6 className="exercise-title">
                    {ex.name}
                  </h6>

                  <p className="exercise-info">
                    Músculo: {ex.target}
                  </p>

                  <p className="exercise-info">
                    Equipo: {ex.equipment}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}