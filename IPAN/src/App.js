import './App.css';
import Navbar from './components/common/Navbar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/Login';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Dashboard />} path='/'/>
        </Route>
        <Route element={<Login />} path='/login' />
      </Routes>
    </>
  );
}

export default App;
