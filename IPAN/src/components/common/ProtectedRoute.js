import React from "react";
import { Cookies } from "react-cookie";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {

    const cookies = new Cookies();
    const location = useLocation();
    const token = cookies.get("token");
    
    return (
        token ? 
            <Outlet/> : <Navigate to="/login" state={{from : location}} replace/>
    )
}

export default ProtectedRoute;
