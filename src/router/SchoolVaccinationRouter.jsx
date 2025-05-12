import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import GenerateReport from "../pages/Reports/GenerateReport";
import StudentManagement from "../pages/StudentManagement";
import VaccinationDriveManagement from "../pages/VaccinationDriveManagement";
import UpdateVaccinationStatus from "../pages/VaccinationManagement/UpdateVaccinationStatus";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

const SchoolVaccinationRouter = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/students"
            element={
              isLoggedIn ? <StudentManagement /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/drives"
            element={
              isLoggedIn ? (
                <VaccinationDriveManagement />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
           <Route
            path="/update-vaccination-status"
            element={
              isLoggedIn ? (
                <UpdateVaccinationStatus />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
           <Route
            path="/generate-report"
            element={
              isLoggedIn ? (
                <GenerateReport />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      
      </Router>
    </ThemeProvider>
  );
};

export default SchoolVaccinationRouter;
