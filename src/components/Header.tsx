import {Link, useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import type { AppDispatch } from "../store";


function Header() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(logout())
        navigate('/login', { replace: true })
    }
    return (
        <header className="header">
            <Link to="/exercises" className="header-link">
                All lesson
            </Link>
            <h2>Bài thực hành react ( ts required )</h2>
            <button type="button" className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </header>
    )
}

export default Header