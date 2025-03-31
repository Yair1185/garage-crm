// ✅ client/src/hooks/useAdminAuth.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('https://garage-crm-app.onrender.com/admin/check-auth');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated;
}
