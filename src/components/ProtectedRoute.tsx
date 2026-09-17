import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector  } from "react-redux";
import type { RootState } from "../store";

function ProtectedRoute() {
    //lấy trạng thái đăng nhập từ state.auth
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    const location = useLocation()
    
    //nếu chưa đăng nhập, chuyển user về trang login
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: `${location.pathname}${location.search}${location.hash}` }}
            />
        )
    }
    return <Outlet />  //đã đăng nhập thì hiển thị route con
}

export default ProtectedRoute
