import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './ManualLoginProvider.css';

const ManualLoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const saveToken = (token: string) => {
    localStorage.setItem('jwtToken', token);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://44.216.113.234:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      console.log(data.token);
      saveToken(data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress className='loading-spinner' />;

  if (!isAuthenticated) {
    return (
      <div className='login-container'>
        <div className='login-box'>
          <h2>Pickleball Court Login</h2>
          {error && <p className='error-message'>{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type='text'
              placeholder='Username'
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
            <input
              type='password'
              placeholder='Password'
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
            <button type='submit'>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ManualLoginProvider;
