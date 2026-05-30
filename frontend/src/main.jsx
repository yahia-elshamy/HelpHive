import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";

// Auth pages (always public)
import Login from "./pages/Login/Login.jsx";
import SignUp from "./pages/Register/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

// Route guards (protected route, role route)
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";

// protected pages
import HomeFeed from "./pages/HomeFeed/HomeFeed.jsx";
import UserDashborad from "./pages/UserDashboard/UserDashboard.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import CreateHelpRequest from "./pages/CreateHelpRequest/CreateHelpRequest.jsx";
import TaskDetails from "./pages/TaskDetails/TaskDetails.jsx";
import VolunteerFlow from "./pages/VolunteerFlow/VolunteerFlow.jsx";
import RealTimeChat from "./pages/RealTimeChat/RealTimeChat.jsx";

// admin only pages
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <SignUp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/home", element: <HomeFeed /> },
      { path: "/dashboard", element: <UserDashborad /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/requests/new", element: <CreateHelpRequest /> },
      { path: "/requests/:id", element: <TaskDetails /> },
      { path: "/tasks/:id", element: <VolunteerFlow /> },
      { path: "/chat/:id", element: <RealTimeChat /> },
    ],
  },
  {
    element: <RoleRoute allowedRoles={["admin"]} />,
    children: [{ path: "/admin", element: <AdminDashboard /> }],
  },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
