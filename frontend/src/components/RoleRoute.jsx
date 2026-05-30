import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

export default function RoleRoute({allowedRoles}) {
    const {isAuthenticated, user} = useSelector((state) => state.auth);

    if(!isAuthenticated) {
        return <Navigate to="/login" replace/>
    }

    if(!allowedRoles.includes(user?.role)) {
        return <Navigate to="/home" replace /> 
    }

    return <Outlet />
}