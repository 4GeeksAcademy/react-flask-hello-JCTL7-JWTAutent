import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-light px-4">
      <Link to="/" className="navbar-brand">Mi App</Link>

      <div>
        {!store.token ? (
          <>
            <Link to="/login" className="btn btn-outline-primary me-2">
              Login
            </Link>
            <Link to="/signup" className="btn btn-outline-success">
              Registro
            </Link>
          </>
        ) : (
          <>
            <Link to="/private" className="btn btn-outline-dark me-2">
              Área Privada
            </Link>
            <button onClick={logout} className="btn btn-danger">
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;