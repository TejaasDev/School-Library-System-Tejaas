
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddBook from './pages/AddBook';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex bg-[#f9f9fab] min-h-screen font-['Outfit',sans-serif]">
          <Navbar />
          <main className="flex-1 ml-72 p-12 min-h-screen">
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add" element={<AddBook />} />
                <Route path="/issue" element={<IssueBook />} />
                <Route path="/return" element={<ReturnBook />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
