import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Dashboard from "./Dashboard";
import PageContainer from "../components/PageContainer";

const Private = () => {
  const { store } = useGlobalReducer();

  // Protección de ruta basada en token
  if (!store.token) {
    return <Navigate to="/login" />;
  }

  return (
    <PageContainer>
      <Dashboard />
    </PageContainer>
  );
};

export default Private;