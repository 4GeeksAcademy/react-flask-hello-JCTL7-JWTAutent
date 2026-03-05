import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoutineCard from "../components/RoutineCard";
import PageContainer from "../components/PageContainer";

export default function Routines() {

  const [routines, setRoutines] = useState([]);
  const [search, setSearch] = useState("");

  const fetchRoutines = async () => {

    try {

      const url = search
        ? `${import.meta.env.VITE_BACKEND_URL}/api/routines?search=${search}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/routines`;

      const res = await fetch(url);
      const data = await res.json();

      setRoutines(data);

    } catch (err) {
      console.error("Error cargando rutinas:", err);
    }

  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRoutines();
  };

  return (
    <PageContainer>

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>Rutinas</h2>

        <Link to="/create-routine" className="btn btn-dark">
          + Crear Rutina
        </Link>

      </div>

      {/* SEARCH */}

      <form className="mb-4" onSubmit={handleSearch}>

        <div className="input-group">

          <input
            type="text"
            className="form-control"
            placeholder="Buscar rutinas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn btn-outline-secondary">
            Buscar
          </button>

        </div>

      </form>

      {/* LISTA */}

      {routines.length === 0 ? (

        <div className="text-center py-5 text-muted">
          <h5>No hay rutinas disponibles</h5>
          <p>Empieza creando tu primera rutina.</p>

          <Link to="/create-routine" className="btn btn-dark mt-2">
            Crear Rutina
          </Link>
        </div>

      ) : (

        <div className="row g-4">

          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
            />
          ))}

        </div>

      )}

    </PageContainer>
  );
}