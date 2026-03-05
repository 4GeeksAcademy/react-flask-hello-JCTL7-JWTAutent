import { useNavigate } from "react-router-dom";

const AuthCard = ({
  title,
  buttonText,
  onSubmit,
  email,
  password,
  setEmail,
  setPassword,
  error,
  footerText,
  footerLinkText,
  footerLinkTo
}) => {

  const navigate = useNavigate();

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "90vh", background: "#f8f9fa" }}
    >
      <div className="card shadow-lg border-0 p-4" style={{ width: "400px" }}>

        <h3 className="text-center fw-bold mb-4">
          {title}
        </h3>

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>

          <input
            className="form-control mb-3"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            className="form-control mb-4"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-dark w-100"
          >
            {buttonText}
          </button>

        </form>

        <div className="text-center mt-3">
          <small>
            {footerText}{" "}
            <span
              style={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigate(footerLinkTo)}
            >
              {footerLinkText}
            </span>
          </small>
        </div>

      </div>
    </div>
  );
};

export default AuthCard;