import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Private = ({ children }) => {
  const { store } = useGlobalReducer();

  if (!store.token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Private;