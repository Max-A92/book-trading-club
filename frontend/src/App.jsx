import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import MyBooksPage from './pages/MyBooksPage';
import ProfilePage from './pages/ProfilePage';
import RequestsPage from './pages/RequestsPage';
import TradesPage from './pages/TradesPage';
import UsersPage from './pages/UsersPage';
import ChatPage from './pages/ChatPage'; 

import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Login - Weiterleitung wenn bereits eingeloggt */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/books" replace />
              ) : (
                <LoginPage />
              )
            } 
          />

          {/* Register - Weiterleitung wenn bereits eingeloggt */}
          <Route 
            path="/register" 
            element={
              isAuthenticated ? (
                <Navigate to="/books" replace />
              ) : (
                <RegisterPage />
              )
            } 
          />

          {/* Books - Alle Bücher anzeigen (Public) */}
          <Route path="/books" element={<BooksPage />} />

          {/* Users - Alle User anzeigen (Public) */}
          <Route path="/users" element={<UsersPage />} />

          {/* Add Book */}
          <Route 
            path="/add-book" 
            element={
              <ProtectedRoute>
                <AddBookPage />
              </ProtectedRoute>
            } 
          />

          {/* Edit Book */}
          <Route 
            path="/edit-book/:bookId" 
            element={
              <ProtectedRoute>
                <EditBookPage />
              </ProtectedRoute>
            } 
          />

          {/* My Books */}
          <Route 
            path="/my-books" 
            element={
              <ProtectedRoute>
                <MyBooksPage />
              </ProtectedRoute>
            } 
          />

          {/* Trade Requests */}
          <Route 
            path="/requests" 
            element={
              <ProtectedRoute>
                <RequestsPage />
              </ProtectedRoute>
            } 
          />

          {/* Trades History */}
          <Route 
            path="/trades" 
            element={
              <ProtectedRoute>
                <TradesPage />
              </ProtectedRoute>
            } 
          />

          {/* Profile */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Chat - Übersicht aller Konversationen */}
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />

          {/* Chat - Spezifische Konversation mit User */}
          <Route 
            path="/chat/:userId" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="*" 
            element={
              <div className="container" style={{ 
                textAlign: 'center', 
                padding: '4rem 1rem' 
              }}>
                <h1>404 - Seite nicht gefunden</h1>
                <p>Die angeforderte Seite existiert nicht.</p>
                <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Zurück zur Startseite
                </a>
              </div>
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;