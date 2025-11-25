import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Importy komponentów
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import TrainingsPage from './pages/TrainingsPage';
import TrainingEditorPage from './pages/TrainingEditorPage'; // Edytor treningu
import ExercisesPage from './pages/ExercisesPage'; // Baza ćwiczeń
import NotificationsPage from './pages/NotificationsPage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';

// Placeholdery dla stron, których jeszcze nie ma
const DashboardPlaceholder = () => <h2 style={{color:'#1B5E20'}}>Dashboard (Statystyki wkrótce)</h2>;
const ReportsPlaceholder = () => <h2 style={{color:'#1B5E20'}}>Zgłoszenia (Wkrótce)</h2>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 1. Publiczna trasa - Logowanie (bez Layoutu) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 2. Prywatne trasy - wymagają logowania */}
          <Route element={<PrivateRoute />}>
              
              {/* 🔥 KLUCZOWE: Wszystkie te strony są wewnątrz Layout */}
              <Route element={<Layout />}>
                  
                  {/* Użytkownicy */}
                  <Route path="/users" element={<UsersPage />} />
                  
                  {/* Treningi - Lista */}
                  <Route path="/trainings" element={<TrainingsPage />} />
                  
                  {/* Treningi - Edytor (Nowa trasa z parametrem ID) */}
                  <Route path="/trainings/:id" element={<TrainingEditorPage />} />
                  
                  {/* Ćwiczenia */}
                  <Route path="/exercises" element={<ExercisesPage />} />
                  
                  {/* Powiadomienia */}
                  <Route path="/notifications" element={<NotificationsPage />} />
                  
                  {/* Zgłoszenia */}
                  <Route path="/reports" element={<ReportsPage />} />

                  <Route path="/dashboard" element={<DashboardPage />} />

              </Route>
          </Route>

          {/* Domyślne przekierowanie na dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;