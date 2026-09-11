import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Welcome from "./pages/Welcome";
import ExerciseList from "./pages/ExerciseList";
import ExerciseDetail from "./pages/ExerciseDetail";
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from "./components/ProtectedRoute";  //component kiểm tra trạng thái đăng nhập

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/exercises" element={<ExerciseList />} />
          <Route path="/exercises/:id" element={<ExerciseDetail />} />
        </Route>
      </Route>
      
    </Routes>
  )
}

export default App
