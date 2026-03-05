import { Link } from "react-router-dom";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-light mt-auto pt-5 pb-3">
      <div className="container">

        <div className="row">

          {/* BRAND */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">💪 Virtual Gym</h5>
            <p className="text-muted small">
              Tu plataforma digital para crear rutinas, seguir metas
              y mejorar tu entrenamiento día a día.
            </p>
          </div>

          {/* NAVEGACIÓN */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-3">Navegación</h6>
            <ul className="list-unstyled small">
              <li>
                <Link to="/" className="footer-link">Inicio</Link>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">Dashboard</Link>
              </li>
              <li>
                <Link to="/routines" className="footer-link">Rutinas</Link>
              </li>
              <li>
                <Link to="/goals" className="footer-link">Metas</Link>
              </li>
            </ul>
          </div>

          {/* REDES */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-3">Síguenos</h6>

            <div className="d-flex gap-3 fs-5">

              <a href="#" className="social-icon">
                <i className="fab fa-github"></i>
              </a>

              <a href="#" className="social-icon">
                <i className="fab fa-linkedin"></i>
              </a>

              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>

              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>

            </div>
          </div>

        </div>

        <hr className="border-secondary"/>

        <div className="text-center small text-muted">
          © {year} Virtual Gym — Built with React & Flask
        </div>

      </div>
    </footer>
  );
};