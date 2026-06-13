// frontend/src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";

// Pages
import Welcome from "./pages/Welcome/Welcome";
import Login from "./pages/Login/Login.jsx";
import SignUp from "./pages/Register/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import HomeFeed from "./pages/HomeFeed/HomeFeed.jsx";
import UserDashboard from "./pages/UserDashboard/UserDashboard.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import CreateHelpRequest from "./pages/CreateHelpRequest/CreateHelpRequest.jsx";
import TaskDetails from "./pages/TaskDetails/TaskDetails.jsx";
import VolunteerFlow from "./pages/VolunteerFlow/VolunteerFlow.jsx";
import RealTimeChat from "./pages/RealTimeChat/RealTimeChat.jsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";

// Guards
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";

// Auth init hook
import useAuthInit from "./hooks/useAuthInit.js";

const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <SignUp /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password/:token", element: <ResetPassword /> },
    {
        element: <ProtectedRoute />,
        children: [
            { path: "/home", element: <HomeFeed /> },
            { path: "/dashboard", element: <UserDashboard /> },
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

// Separate component so we can use hooks (hooks can't run in createRoot)
function Root() {
    const { isAuthReady } = useAuthInit();

    // Don't render routes until we know if the user is logged in
    // This prevents a flash of the login page before the token is refreshed
    if (!isAuthReady) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFF8F2"
                }}
            >
                {/* You can replace this with your bee mascot/spinner later */}
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <Root />
        </Provider>
    </StrictMode>
);