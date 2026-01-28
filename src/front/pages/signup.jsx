import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || "Error al registrar usuario");
        return;
      }

      alert("Usuario creado correctamente");
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Correo"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Contraseña"
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit" className="btn btn-primary">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Signup;