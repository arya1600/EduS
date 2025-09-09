import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";
import MyCourses from "./pages/MyCourses";
import Feedback from "./pages/Feedback";
import Support from "./pages/Support";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const user = JSON.parse(localStorage.getItem("user")); // { role: "user" | "admin" }

  const hideNavbarPaths = ["/", "/login", "/signup"];
  const currentPath = window.location.pathname;

  return (
    <BrowserRouter>
      {!hideNavbarPaths.includes(currentPath) && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/courses" element={<Courses />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/support" element={<Support />} />
        {user?.role === "admin" && (
          <Route path="/admin" element={<AdminDashboard />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
