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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "routines", element: <Routines /> },
      { path: "create-routine", element: <CreateRoutine /> },
      { path: "goals", element: <Goals /> },
      { path: "explore", element: <ExploreExercises/> }
    ]
  }
]);