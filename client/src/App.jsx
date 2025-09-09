import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import TopRated from "./pages/TopRated";
import Instructor from "./pages/Instructor";
import AdminDashboard from "./pages/AdminDashboard";
import EnrolledCourses from "./pages/EnrolledCourses";
import Feedback from "./pages/Feedback";
import Support from "./pages/Support";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route
                  path="/home"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <PrivateRoute>
                      <Courses />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/top-rated"
                  element={
                    <PrivateRoute>
                      <TopRated />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/instructors"
                  element={
                    <PrivateRoute>
                      <Instructor />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/enrolled"
                  element={
                    <PrivateRoute>
                      <EnrolledCourses />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/feedback"
                  element={
                    <PrivateRoute>
                      <Feedback />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/support"
                  element={
                    <PrivateRoute>
                      <Support />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
