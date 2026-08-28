import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  // On mount: restore session from localStorage token
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const restoreSession = async () => {
      const savedToken = localStorage.getItem('placeprep_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setProfile(res.data.profile);
        } else {
          localStorage.removeItem('placeprep_token');
          localStorage.removeItem('placeprep_user');
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        localStorage.removeItem('placeprep_token');
        localStorage.removeItem('placeprep_user');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password, expectedRole) => {
    const res = await API.post('/auth/login', { email, password, expectedRole });
    if (res.data.success) {
      localStorage.setItem('placeprep_token', res.data.token);
      localStorage.setItem('placeprep_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setProfile(res.data.profile);
    }
    return res.data;
  };

  const demoLogin = async (role) => {
    const res = await API.post('/auth/demo-login', { role });
    if (res.data.success) {
      localStorage.setItem('placeprep_token', res.data.token);
      localStorage.setItem('placeprep_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setProfile(res.data.profile);
    }
    return res.data;
  };

  const registerStudent = async (formData) => {
    const res = await API.post('/auth/register/student', formData);
    if (res.data.success) {
      localStorage.setItem('placeprep_token', res.data.token);
      localStorage.setItem('placeprep_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setProfile(res.data.profile);
    }
    return res.data;
  };

  const registerRecruiter = async (formData) => {
    const res = await API.post('/auth/register/recruiter', formData);
    if (res.data.success) {
      localStorage.setItem('placeprep_token', res.data.token);
      localStorage.setItem('placeprep_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('placeprep_token');
    localStorage.removeItem('placeprep_user');
    setUser(null);
    setProfile(null);
  };

  const updateLocalProfile = (updatedProfile) => setProfile(updatedProfile);
  const updateUser = (updatedData) => setUser(prev => ({ ...prev, ...updatedData }));

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      demoLogin,
      registerStudent,
      registerRecruiter,
      logout,
      updateLocalProfile,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
