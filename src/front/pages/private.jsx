import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Private = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN EN PRIVATE:", token);
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          dispatch({ type: "logout" });
          navigate("/login");
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) setMessage(data.msg);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      <h1>Área Privada</h1>
      <p>{message}</p>
      <p>Si ves esto, estás autenticado 🎉</p>
    </div>
  );
};

export default Private;