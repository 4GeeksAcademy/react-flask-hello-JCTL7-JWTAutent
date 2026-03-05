import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import AuthCard from "../components/AuthCard";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

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

      if (!response.ok) {
        setError(data.msg || "Error al iniciar sesión");
        return;
      }

      dispatch({
        type: "login",
        payload: data
      });

      navigate("/dashboard");

    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <AuthCard
      title="Iniciar Sesión"
      buttonText="Entrar"
      onSubmit={handleSubmit}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      error={error}
      footerText="¿No tienes cuenta?"
      footerLinkText="Crear cuenta"
      footerLinkTo="/signup"
    />
  );
};

export default Login;