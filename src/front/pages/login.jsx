import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Login = () => {
  const { store, dispatch } = useGlobalReducer();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        alert(data.msg || "Error al iniciar sesión");
        return;
      }

      // Guardar token
      localStorage.setItem("token", data.token);

      // Actualizar estado global
      dispatch({
        type: "login_success",
        payload: {
          token: data.token,
          user: {
            id: data.user_id,
            email: data.email
          }
        }
      });

      navigate("/private");

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>

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

        <button className="btn btn-primary">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;