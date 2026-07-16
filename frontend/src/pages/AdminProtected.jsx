import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminProtected({ children }) {
  const authed = localStorage.getItem('srl-admin-auth') === '1';
  if (!authed) return <Navigate to="/admin" replace />;
  return children;
}
