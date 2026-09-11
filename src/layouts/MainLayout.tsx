import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import './MainLayout.css'

function MainLayout() {
    return (
        <div className="layout">
            <Header />

            <div className="layout-body">
                <Sidebar />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout