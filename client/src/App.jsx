import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import Layout from './pages/Layout'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem('token');
    dispatch(setLoading(true));
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', { headers: { Authorization: `Bearer ${token}` } });
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
      }
    } catch (error) {
      console.log("Session restore failed:", error.message);
      localStorage.removeItem('token');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Toaster />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/view/:resumeId' element={<Preview />} />

        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path='app' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='builder/:resumeId' element={<ResumeBuilder />} />
          </Route>
          {/* The ATS Scanner route has been removed */}
        </Route>
      </Routes>
    </>
  );
};

export default App;