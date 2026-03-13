import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Routines from "./pages/Routines";
import CreateRoutine from "./pages/CreateRoutine";
import Goals from "./pages/Goals";
import ExploreExercises from "./pages/ExploreExercises";
import RoutineDetail from "./pages/RoutineDetail";
import Private from "./pages/private"; 
import ExerciseDetail from './pages/ExerciseDetail';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      // Rutas públicas
      { path: "routines", element: <Routines /> },
      { path: "explore", element: <ExploreExercises /> },
      { path: "routines/:id", element: <RoutineDetail /> },
      // Rutas privadas (requieren autenticación)
      {
        path: "dashboard",
        element: <Private><Dashboard /></Private>
      },
      {
        path: "create-routine",
        element: <Private><CreateRoutine /></Private>
      },
      {
        path: "goals",
        element: <Private><Goals /></Private>
      },
      { 
        path: "exercise/:id",
         element: <ExerciseDetail /> 
      }
    ]
  }
]);