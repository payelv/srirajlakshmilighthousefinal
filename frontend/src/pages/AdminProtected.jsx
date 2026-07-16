import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../api';

export default function AdminProtected({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const token = localStorage.getItem('srl-token');
    if (!token) {
      setStatus('nope');
      return;
    }
    authApi
      .verify()
      .then(() => setStatus('ok'))
      .catch(() => {
        localStorage.removeItem('srl-token');
        setStatus('nope');
      });
  }, []);

  if (status === 'checking') return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Verifying…</div>;
  if (status === 'nope') return <Navigate to="/admin" replace />;
  return children;
}
