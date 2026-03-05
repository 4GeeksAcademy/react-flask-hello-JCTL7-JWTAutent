import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

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
        setError(data.msg || "Error al registrar usuario");
        return;
      }

      alert("Usuario creado correctamente");
      navigate("/login");

    } catch (error) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <AuthCard
      title="Crear Cuenta"
      buttonText="Registrarse"
      onSubmit={handleSubmit}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      error={error}
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión"
      footerLinkTo="/login"
    />
  );
};

export default Signup;