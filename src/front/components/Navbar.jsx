import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const isAuthenticated = !!store.token;

  const logout = () => {
    dispatch({ type: "logout" });
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">

      <div className="container-fluid">

        {/* BRAND */}

        <Link to="/" className="navbar-brand fw-bold fs-4">
          🏋️ FitGym Virtual
        </Link>


        {/* MOBILE BUTTON */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        <div className="collapse navbar-collapse" id="navbarContent">


          {/* LEFT LINKS */}

          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">
                Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/explore">
                Ejercicios
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/routines">
                Rutinas
              </Link>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/dashboard">
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/goals">
                    Metas
                  </Link>
                </li>
              </>
            )}

          </ul>


          {/* RIGHT SIDE */}

          <div className="d-flex align-items-center gap-3">

            {!isAuthenticated ? (

              <>
                <Link to="/login" className="btn btn-outline-dark">
                  Iniciar sesión
                </Link>

                <Link to="/signup" className="btn btn-dark">
                  Registrarse
                </Link>
              </>

            ) : (

              <>
                <span className="text-muted small">
                  {store.user?.email}
                </span>

                <span className="badge bg-success">
                  {store.user?.points || 0} pts
                </span>

                <button
                  onClick={logout}
                  className="btn btn-danger"
                >
                  Cerrar sesión
                </button>
              </>

            )}

          </div>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;